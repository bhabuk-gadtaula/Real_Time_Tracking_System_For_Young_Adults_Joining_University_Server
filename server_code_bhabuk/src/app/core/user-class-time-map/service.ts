import { UserRole, userService } from '../user-management';
import { calculatePagination } from '../../shared/utils/pagination';
import { ClassTimeMappingEntity, UserClassMappingEntity } from './entity';
import { ClassTimeMapRepository, UserClassMapRepository } from './repository';
import { IClassTriggerFindQueryParams, IUserClassMapFindQueryParams } from './interface';
import { Assigner, BaseService, CustomError, IServiceOptions, assigner } from '../../shared';
import { ICreateClassTriggerTimeSchema, ICreateClassUserMapSchema, IUpdateClassUserMapSchema } from '../class/validation';

export class UserClassMapService extends BaseService<UserClassMappingEntity> {
  constructor(protected repository: UserClassMapRepository) {
    super(repository);
  }

  async createMapUserWithClass(body: ICreateClassUserMapSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const user = await userService.findOneBy({ id: body.userId }, options);
    if (!user) throw new CustomError('User not found', 400);
    if (user.role === UserRole.PARENT) throw new CustomError('Parent role user not be map to classes directly!', 400);

    const payload: UserClassMappingEntity = {
      classId: body.classId,
      userId: body.userId,
      createdBy: options?.authUser?.id,
      updatedBy: options?.authUser?.id,
      classTriggerId: body.classTriggerId,
    };

    const result = await super.create(payload);

    return await this.fetchUserClassTriggerByIdOnly({ id: result.id }, options);
  }

  async updateMapUserWithClass(params: { classId: number; classUserMapId: number }, body: IUpdateClassUserMapSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const mapUserClass = await this.repository.model.findOneBy({ id: params.classUserMapId, classId: params.classId, isActive: true });
    if (!mapUserClass) throw new CustomError('User class mapping not found', 400);

    const payload = {
      classId: params.classId,
      userId: body.userId,
      updatedAt: new Date(),
      updatedBy: options?.authUser?.id,
      classTriggerId: body.classTriggerId,
    } as UserClassMappingEntity;

    await this.repository.model.update({ id: params.classUserMapId }, payload);

    return await this.fetchUserClassTriggerByIdOnly({ id: params.classUserMapId }, options);
  }

  async removeMapUserWithClass(params: { classUserMapId: number; classId: number }, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const mapUserClass = await this.repository.model.findOneBy({ id: params.classUserMapId, classId: params.classId, isActive: true });
    if (!mapUserClass) throw new CustomError('User class not mapping', 400);

    const payload = {
      deletedAt: new Date(),
      deletedBy: options?.authUser?.id,
      isActive: false,
    } as UserClassMappingEntity;

    await this.repository.model.update({ id: params.classUserMapId, classId: params.classId }, payload);

    return await this.fetchUserClassTriggerByIdOnly({ id: params.classUserMapId }, options);
  }

  //fetch the user with associated class by mapId
  async fetchUserClassId(params: Partial<UserClassMappingEntity>, options?: IServiceOptions) {
    const replacements: any[] = [];
    let queryBuilder = `select
    json_build_object(
        'name', classes.name,
        'id', classes.id
    ) as class,
    json_build_object(
      'id', users.id,
      'email', users.email,
      'firstName', users.first_name ,
      'middleName', COALESCE(users.middle_name, ''),
      'lastName', users.last_name,
      'phone', COALESCE(users.phone, ''),
      'role', users.role
    ) as user,
    json_build_object(
        'id', cttm.id,
        'triggerDate', cttm.class_trigger_date_time
    ) as "classTriggerDate",
    ucm.id as "userClassMapId",
    ${assigner('ucm', Assigner.CREATED)},
    ${assigner('ucm', Assigner.UPDATED)}`;

    queryBuilder += `
      from class as classes
      inner join user_class_mapping ucm
        on classes.id = ucm.class_id and classes.is_active = true and ucm.is_active = true
      inner join class_trigger_time_mapping cttm
        on cttm.id = ucm.class_trigger_id and cttm.is_active = true
      inner join users
        on users.id = ucm.user_id and users.is_active = true and users.status = 'ACTIVE'
    `;

    queryBuilder += `where ucm.id = $${replacements.length + 1};`;
    replacements.push(params.id);

    const result = await this.repository.model.query(queryBuilder, replacements);

    return result.length ? result[0] : null;
  }
  //fetch all the map classes with users associated with parent only
  async fetchUserClasses(query: IUserClassMapFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);
    const replacements: any[] = [];
    let queryBuilder = `select
    json_build_object(
        'name', classes.name,
        'id', classes.id
    ) as class,
    json_build_object(
      'id', users.id,
      'email', users.email,
      'firstName', users.first_name ,
      'middleName', COALESCE(users.middle_name, ''),
      'lastName', users.last_name,
      'phone', COALESCE(users.phone, ''),
      'role', users.role
    ) as user,
    json_build_object(
      'id', cttm.id,
      'triggerDate', cttm.class_trigger_date_time
    ) as "classTriggerDate",
    ucm.id as "userClassMapId",
    ${assigner('ucm', Assigner.CREATED)},
    ${assigner('ucm', Assigner.UPDATED)}`;

    queryBuilder += 'from class as classes';
    if (query?.classId) {
      replacements.push(query.classId);
      queryBuilder += `
        inner join user_class_mapping ucm
        on classes.id = ucm.class_id and classes.id = $${replacements.length} and classes.is_active = true and ucm.is_active = true
      `;
    } else {
      queryBuilder += `
        inner join user_class_mapping ucm
        on classes.id = ucm.class_id and classes.is_active = true and ucm.is_active = true
      `;
    }

    queryBuilder += `
      inner join class_trigger_time_mapping cttm
        on cttm.id = ucm.class_trigger_id and cttm.is_active = true
      inner join users
        on users.id = ucm.user_id and users.is_active = true and users.status = 'ACTIVE'
    `;

    queryBuilder += `offset $${replacements.length + 1} limit $${replacements.length + 2}`;
    replacements.push(offset);
    replacements.push(limit);

    const result = await this.repository.model.query(queryBuilder, replacements);

    return { rows: result, count: result.length };
  }

  async fetchUserClassTriggerByIdOnly(params: Partial<UserClassMappingEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          ucm.user_id as "userId",
          ucm.class_id as "classId",
          ucm.class_trigger_id as "classTriggerI",
          ucm.id as "id",
          ucm.is_active as "active",
          ${assigner('ucm', Assigner.CREATED)},
          ${assigner('ucm', Assigner.UPDATED)}
        from user_class_mapping ucm
        where ucm.id = $1;
      `,
      [params.id]
    );

    return result?.length ? result[0] : null;
  }
}

export class ClassTimeMapService extends BaseService<ClassTimeMappingEntity> {
  constructor(protected repository: ClassTimeMapRepository) {
    super(repository);
  }

  async createClassTriggerTime(body: ICreateClassTriggerTimeSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const payload: ClassTimeMappingEntity = {
      classId: body.classId,
      createdBy: options?.authUser?.id,
      updatedBy: options?.authUser?.id,
      classTriggerDateTime: body.classTriggerDateTime,
    };

    const result = await super.create(payload);

    return await this.fetchClassTriggerOnlyById({ id: result.id });
  }

  async updateClassTriggerTime(params: { classId: number; classTriggerMapId: number }, body: { classTriggerDateTime: Date }, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const mapUserClass = await this.repository.model.findOneBy({ id: params.classTriggerMapId, classId: params.classId, isActive: true });
    if (!mapUserClass) throw new CustomError('User class not mapping', 400);

    const payload = {
      classTriggerDateTime: body.classTriggerDateTime,
      updatedAt: new Date(),
      updatedBy: options?.authUser?.id,
    } as ClassTimeMappingEntity;

    await this.repository.model.update({ id: params.classTriggerMapId, classId: params.classId, isActive: true }, payload);

    return await this.fetchClassTriggerOnlyById({ id: params.classTriggerMapId });
  }

  async removeClassTriggerTime(params: { classId: number; classTriggerMapId: number }, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const mapUserClass = await this.repository.model.findOneBy({ id: params.classTriggerMapId, classId: params.classId, isActive: true });
    if (!mapUserClass) throw new CustomError('User class not mapping', 400);

    const payload = {
      deletedAt: new Date(),
      deletedBy: options?.authUser?.id,
      isActive: false,
    } as ClassTimeMappingEntity;

    await this.repository.model.update({ id: params.classTriggerMapId, classId: params.classId, isActive: true }, payload);

    return await this.fetchClassTriggerOnlyById({ id: params.classTriggerMapId });
  }

  //fetch the class trigger time mapId
  async fetchClassTriggerTimeById(params: Partial<ClassTimeMappingEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          json_build_object(
              'name', classes.name,
              'id', classes.id
          ) as class,
          cttm.class_trigger_date_time as "classTriggerDateTime",
          cttm.id as "classTriggerId",
          ${assigner('cttm', Assigner.CREATED)},
          ${assigner('cttm', Assigner.UPDATED)}
        from class as classes
        inner join class_trigger_time_mapping cttm
            on classes.id = cttm.class_id and classes.is_active =  true and cttm.is_active = true
        where cttm.id = $1;
      `,
      [params.id]
    );

    return result?.length ? result[0] : null;
  }

  //fetch all classes trigger time associated with classes for all users
  async fetchClassesTriggerTime(query: IClassTriggerFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);
    const replacements: any[] = [];

    let queryBuilder = `
      select
      json_build_object(
          'name', classes.name,
          'id', classes.id
      ) as class,
      cttm.class_trigger_date_time as "classTriggerDateTime",
      cttm.id as "classTriggerId",
      ${assigner('cttm', Assigner.CREATED)},
      ${assigner('cttm', Assigner.UPDATED)}
    `;

    queryBuilder += 'from class as classes';

    if (query?.classId) {
      replacements.push(query.classId);
      queryBuilder += `
            inner join class_trigger_time_mapping cttm
            on classes.id = cttm.class_id and classes.is_active =  true and cttm.is_active = true and cttm.class_id = $${replacements.length}
          `;
    } else {
      queryBuilder += `
            inner join class_trigger_time_mapping cttm
            on classes.id = cttm.class_id and classes.is_active =  true and cttm.is_active = true
          `;
    }

    queryBuilder += `offset $${replacements.length + 1} limit $${replacements.length + 2}`;
    replacements.push(offset);
    replacements.push(limit);

    const result = await this.repository.model.query(queryBuilder, replacements);

    return { rows: result, count: result.length };
  }

  async fetchClassTriggerOnlyById(params: Partial<ClassTimeMappingEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          cttm.class_trigger_date_time as "classTriggerDateTime",
          cttm.id as "id",
          cttm.is_active as "active",
          ${assigner('cttm', Assigner.CREATED)},
          ${assigner('cttm', Assigner.UPDATED)}
        from class_trigger_time_mapping cttm
        where cttm.id = $1;
      `,
      [params.id]
    );

    return result?.length ? result[0] : null;
  }
}
