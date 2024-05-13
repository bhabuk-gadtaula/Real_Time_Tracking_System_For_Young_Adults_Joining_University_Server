import bcrypt from 'bcrypt';
import { UsersEntity } from './entity';
import UserRepository from './repository';
import { OtpEntity } from '../otp/entity';
import { Scope, otpService } from '../otp';
import { assigner } from '../../shared/utils/assigner';
import { BaseService } from '../../shared/base/service';
import { calculatePagination } from '../../shared/utils/pagination';
import { IFindQueryParams, UserRole, UserStatus } from './interface';
import { Assigner, CustomError, IServiceOptions, ProjectTableName, appendStringToEmail, mailSenderHelper } from '../../shared';
import {
  ICreateUserValidationSchema,
  IForgetPasswordOtpGenerationValidationSchema,
  IForgetPasswordValidationSchema,
  IRegisterUserValidationSchema,
  IUpdateUserPasswordValidationSchema,
  IUpdateUserProfileValidationSchema,
} from './validation';

export default class UserService extends BaseService<UsersEntity> {
  constructor(protected repository: UserRepository) {
    super(repository);
  }

  async register(body: IRegisterUserValidationSchema) {
    const user = await this.findOneBy({ email: body.email, status: UserStatus.ACTIVE });

    if (user) throw new CustomError('User already registered', 400);

    body.password = await bcrypt.hash(body.password, 10);

    delete body.confirmPassword;

    const payload: UsersEntity = {
      ...body,
      status: UserStatus.ACTIVE,
    } as UsersEntity;

    const insertedData = await super.create(payload);

    return await this.findOneById({ id: insertedData.id });
  }

  async findOneBy(params: Partial<UsersEntity>, options?: IServiceOptions) {
    return await this.repository.model.findOneBy({ ...params });
  }

  async findOneById(params: Partial<UsersEntity>, options?: IServiceOptions): Promise<UsersEntity | null> {
    const result = await this.repository.model.query(
      `
        select
          id,
          email,
          first_name as "firstName",
          middle_name as "middleName",
          last_name as "lastName",
          phone,
          role,
          ${assigner(ProjectTableName.USER, Assigner.CREATED)},
          ${assigner(ProjectTableName.USER, Assigner.UPDATED)},
          ancestor_id as "ancestorId"
        from users
        where users.id = $1 and users.status = $2
      `,
      [params.id, UserStatus.ACTIVE]
    );

    return result.length ? result[0] : null;
  }

  async updateProfile(body: IUpdateUserProfileValidationSchema, options?: IServiceOptions) {
    return await this.update(options.authUser.id, body, options);
  }

  async updateInfo(params: Partial<UsersEntity>, body: IUpdateUserProfileValidationSchema, options?: IServiceOptions) {
    if (params.id === options.authUser.id) throw new CustomError('User cannot update their own account', 400);

    if (options.authUser.role === UserRole.CHILD) throw new CustomError('Child user role cannot operate update permission', 400);

    if (options.authUser.role === UserRole.ADMIN) {
      const user = await this.findOneBy({ id: params.id, status: UserStatus.ACTIVE }, options);

      if (user.role !== UserRole.ADMIN) throw new CustomError('Admin user cannot update, permission denied', 400);
    }

    if (options.authUser.role === UserRole.PARENT) {
      const user = await this.findOneBy(
        {
          id: params.id,
          status: UserStatus.ACTIVE,
          // ancestorId: options?.authUser?.id
        },
        options
      );

      if (!user) throw new CustomError('Parent user cannot update, permission denied', 400);
    }

    return await this.update(params.id, body, options);
  }

  private async update(userId: number, body: IUpdateUserProfileValidationSchema, options?: IServiceOptions) {
    const user = await this.findOneById({ id: userId }, options);

    if (!user) throw new CustomError('User not found', 400);

    await this.repository.model.update({ id: user.id }, { ...body, updatedBy: options.authUser.id, updatedAt: new Date() });

    return this.findOneById({ id: user.id }, options);
  }

  async updatePassword(body: IUpdateUserPasswordValidationSchema, options?: IServiceOptions) {
    const user = await this.findOneBy({ id: options.authUser.id, status: UserStatus.ACTIVE });

    if (!user) throw new CustomError('User not found', 400);

    const comparePassword = await bcrypt.compare(body.password, user.password);

    if (!comparePassword) throw new CustomError('User password mismatch', 400);

    await this.repository.model.update(
      { id: user.id },
      { password: await bcrypt.hash(body.newPassword, 10), updatedBy: options.authUser.id, updatedAt: new Date() }
    );

    return {
      id: user.id,
    };
  }

  async createProfile(data: ICreateUserValidationSchema, options?: IServiceOptions) {
    let flag = false;
    let ancestorId: number;
    let email: string;
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child user role cannot operate create permission', 400);

    if (options?.authUser?.role === UserRole.PARENT && data.role !== UserRole.ADMIN) flag = true;

    if (options?.authUser?.role === UserRole.ADMIN && data.role === UserRole.ADMIN) flag = true;

    if (!flag) throw new CustomError(`${options?.authUser?.role} User role cannot create ${data.role}, permission denied`, 400);

    if (data.role !== UserRole.CHILD) {
      const user = await this.findOneBy({ email: data.email, status: UserStatus.ACTIVE });
      if (user) throw new CustomError('User already registered', 400);
    }

    if (data.role === UserRole.CHILD) {
      ancestorId = options?.authUser?.id;
      const availableChildren = await this.repository.model.query('SELECT COUNT(*) as "maxChild" FROM users where ancestor_id = $1 ', [ancestorId]);
      const retrieveLatestId = await this.repository.model.query('SELECT MAX(id) as "uniqueId" FROM users;');
      email = appendStringToEmail(options?.authUser?.email, `+${data.firstName.toLocaleLowerCase()}${availableChildren[0].maxChild ?? 1}`);
    }

    data.password = await bcrypt.hash(data.password, 10);

    delete data.confirmPassword;

    const payload: UsersEntity = {
      ...data,
      status: UserStatus.ACTIVE,
      createdBy: options.authUser.id,
      updatedBy: options.authUser.id,
      ...(data.role === UserRole.CHILD && { ancestorId, email }),
    } as UsersEntity;

    const insertedData = await super.create(payload);

    return await this.findOneById({ id: insertedData.id }, options);
  }

  async deleteProfile(params: Partial<UsersEntity>, options?: IServiceOptions) {
    if (params.id === options.authUser.id) throw new CustomError('User cannot delete their own account', 400);

    if (options.authUser.role === UserRole.CHILD) throw new CustomError('Child user role cannot operate delete permission', 400);

    if (options.authUser.role === UserRole.ADMIN) {
      const user = await this.findOneBy({ id: params.id, status: UserStatus.ACTIVE }, options);

      if (user.role !== UserRole.ADMIN) throw new CustomError('Admin user cannot delete, permission denied', 400);
    }

    if (options.authUser.role === UserRole.PARENT) {
      const user = await this.findOneBy(
        {
          id: params.id,
          status: UserStatus.ACTIVE,
          // ancestorId: options?.authUser?.id
        },
        options
      );

      if (!user) throw new CustomError('User not found', 400);
    }

    await this.repository.model.update(params.id, { status: UserStatus.INACTIVE, deletedAt: new Date(), deletedBy: options?.authUser?.id });

    return await this.findOneById({ id: params.id }, options);
  }

  async find(query: IFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);
    let ancestorId: number;
    if (options?.authUser?.role === UserRole.ADMIN) return { rows: [], count: 0 };

    if (options?.authUser?.role === UserRole.PARENT) {
      if (query?.role === UserRole.CHILD) {
        if (isNaN(Number(query.ancestorId ?? options.authUser.id))) throw new CustomError('Ancestor Id must be in number', 400);
        else ancestorId = Number(query.ancestorId ?? options.authUser.id);

        const result = await this.repository.model.query(
          `
          select
            id,
            email,
            first_name as "firstName",
            middle_name as "middleName",
            last_name as "lastName",
            phone,
            role,
            ${assigner(ProjectTableName.USER, Assigner.CREATED)},
            ${assigner(ProjectTableName.USER, Assigner.UPDATED)},
            ancestor_id as "ancestorId"
          from users
          where status = $1 and role= $2 and ancestor_id = $3
          offset $4
          limit $5;
        `,
          [UserStatus.ACTIVE, UserRole.CHILD, ancestorId, offset, limit]
        );

        return { rows: result, count: result.length };
      }

      const result = await this.repository.model.query(
        `
          select
            id,
            email,
            first_name as "firstName",
            middle_name as "middleName",
            last_name as "lastName",
            phone,
            role,
            ${assigner(ProjectTableName.USER, Assigner.CREATED)},
            ${assigner(ProjectTableName.USER, Assigner.UPDATED)},
            ancestor_id as "ancestorId"
          from users
          where status = $1 and role= $2
          offset $3
          limit $4;
        `,
        [UserStatus.ACTIVE, UserRole.PARENT, offset, limit]
      );

      return { rows: result, count: result.length };
    }

    if (options?.authUser?.role === UserRole.CHILD) {
      if (!query?.ancestorId) {
        const user = await this.findOneBy({ id: options?.authUser?.id }, options);
        ancestorId = user.ancestorId;

        const result = await this.repository.model.query(
          `
          select
            id,
            email,
            first_name as "firstName",
            middle_name as "middleName",
            last_name as "lastName",
            phone,
            role,
            ${assigner(ProjectTableName.USER, Assigner.CREATED)},
            ${assigner(ProjectTableName.USER, Assigner.UPDATED)},
            ancestor_id as "ancestorId"
          from users
          where status = $1 and role= $2 and ancestor_id = $3
          offset $4
          limit $5;
        `,
          [UserStatus.ACTIVE, UserRole.CHILD, ancestorId, offset, limit]
        );

        return { rows: result, count: result.length };
      }
    }
  }

  async forgotPasswordOtpGeneration(body: IForgetPasswordOtpGenerationValidationSchema, options?: IServiceOptions) {
    const user = await this.findOneBy({ email: body.email, status: UserStatus.ACTIVE }, options);
    if (!user) throw new CustomError('User not found', 400);

    let otp: OtpEntity;
    if (body.resend) otp = await otpService.resendOtp({ scope: Scope.FORGOT_PASSWORD, userId: user.id }, options);
    else otp = await otpService.createOtp({ scope: Scope.FORGOT_PASSWORD, userId: user.id }, options);

    if (!otp) throw new CustomError('Otp cannot be created', 400);

    mailSenderHelper.sendMail(body.email, 'Forgot Password OTP', `Your otp is ${otp.otp}`);

    return {
      id: user.id,
      email: body.email,
    };
  }

  async forgotPassword(body: IForgetPasswordValidationSchema, options?: IServiceOptions) {
    const user = await this.findOneBy({ email: body.email, status: UserStatus.ACTIVE }, options);
    if (!user) throw new CustomError('User not found', 400);

    const validateOtp = await otpService.validateOtp({ otp: body.otp, scope: Scope.FORGOT_PASSWORD, userId: user.id }, options);

    await otpService.revokeOtp({ otpId: validateOtp.otpId, userId: user.id }, options);

    await this.repository.model.update(
      { id: user.id },
      { password: await bcrypt.hash(body.password, 10), updatedBy: options?.authUser?.id ?? user.id, updatedAt: new Date() }
    );

    return {
      id: user.id,
      email: body.email,
    };
  }

  async fetchUserAssociateClassWithTriggerTime(options?: IServiceOptions) {
    const replacement: any[] = [];
    let queryBuilder = `
      select
      json_build_object(
        'name', c.name,
        'id', c.id
      ) as class,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'firstName', u.first_name ,
        'middleName', COALESCE(u.middle_name, ''),
        'lastName', u.last_name,
        'phone', COALESCE(u.phone, ''),
        'role', u.role
      ) as user,
      json_build_object(
        'id', cttm.id,
        'triggerDate', cttm.class_trigger_date_time
      ) as "classTriggerDate",
      ${assigner('u', Assigner.CREATED)},
      ${assigner('u', Assigner.UPDATED)}
    `;

    queryBuilder += 'from users u';

    replacement.push(options?.authUser?.id);
    queryBuilder +=
      options?.authUser?.role === UserRole.PARENT
        ? `
            inner join user_class_mapping ucm
            on u.id = ucm.user_id and u.is_active = true and u.status = 'ACTIVE' and u.ancestor_id = $${replacement.length} and ucm.is_active = true
          `
        : `
            inner join user_class_mapping ucm
            on u.id = ucm.user_id and u.is_active = true and u.status = 'ACTIVE' and u.id = $${replacement.length} and ucm.is_active = true
          `;
    queryBuilder += `
      inner join class c
        on ucm.class_id = c.id and ucm.user_id = u.id and c.is_active = true
      inner join class_trigger_time_mapping cttm
        on c.id = cttm.class_id and cttm.is_active = true
    `;

    const result = await this.repository.model.query(queryBuilder, replacement);

    return { rows: result, count: result.length };
  }
}
