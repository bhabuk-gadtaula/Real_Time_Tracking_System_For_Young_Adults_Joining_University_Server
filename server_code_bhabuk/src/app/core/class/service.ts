import { ClassEntity } from './entity';
import ClassRepository from './repository';
import { UserRole } from '../user-management';
import { IFindQueryParams } from './interface';
import { notificationService } from '../notification';
import { calculatePagination } from '../../shared/utils/pagination';
import { classTimeMapService, userClassMapService } from '../user-class-time-map';
import { Assigner, BaseService, CustomError, IServiceOptions, ProjectModule, ProjectTableName, assigner } from '../../shared';
import {
  ICreateClassTriggerTimeSchema,
  ICreateClassUserMapSchema,
  ICreateClassValidationSchema,
  IUpdateClassTriggerTimeSchema,
  IUpdateClassUserMapSchema,
  IUpdateClassValidationSchema,
} from './validation';

export default class ClassService extends BaseService<ClassEntity> {
  constructor(protected repository: ClassRepository) {
    super(repository);
  }

  async createClass(body: ICreateClassValidationSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const payload: ClassEntity = {
      name: body.name,
      userParentId: options?.authUser.id,
      createdBy: options.authUser.id,
      updatedBy: options.authUser.id,
    };

    const insertedData = await super.create(payload);

    // await notificationService.createNotification({
    //   note: `${body.name} class is created`,
    //   assigner: options?.authUser?.parentId,
    //   moduleName: ProjectModule.CLASS,
    // });

    return await this.findOneById({ id: insertedData.id }, options);
  }

  async updateOne(params: Partial<ClassEntity>, body: IUpdateClassValidationSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const _class = await this.getClassBy({ id: params.id }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    if (body?.name) {
      await this.repository.model.update({ id: params.id }, { ...body, updatedAt: new Date(), updatedBy: options?.authUser?.id });
    }

    console.log(options?.authUser?.parentId);

    // await notificationService.createNotification({
    //   note: `${body.name} class is updated`,
    //   assigner: options?.authUser?.parentId,
    //   moduleName: ProjectModule.CLASS,
    // });

    return await this.findOneById({ id: params.id }, options);
  }

  async deleteOne(params: Partial<ClassEntity>, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child role user, permission denied!', 400);

    const _class = await this.getClassBy({ id: params.id }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    await this.repository.model.update({ id: params.id }, { deletedAt: new Date(), deletedBy: options?.authUser?.id, isActive: false });

    // await notificationService.createNotification({
    //   note: `${_class?.name} class is deleted`,
    //   assigner: options?.authUser?.parentId,
    //   moduleName: ProjectModule.CLASS,
    // });

    return await this.findOneById({ id: params.id }, options);
  }

  async findOneById(params: Partial<ClassEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          id,
          name,
          ${assigner(ProjectTableName.CLASS, Assigner.CREATED)},
          ${assigner(ProjectTableName.CLASS, Assigner.UPDATED)}
        from class
        where id = $1 and is_active = true and class.user_parent_id = $2;
      `,
      [params.id, options?.authUser?.parentId]
    );

    return result.length ? result[0] : null;
  }

  async find(query: IFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);

    const result = await this.repository.model.query(
      `
        select
          id,
          name,
          ${assigner(ProjectTableName.CLASS, Assigner.CREATED)},
          ${assigner(ProjectTableName.CLASS, Assigner.UPDATED)}
        from class
        where is_active = true and class.user_parent_id = $3
        offset $1
        limit $2;
      `,
      [offset, limit, options.authUser.parentId]
    );

    return { rows: result, count: result.length };
  }

  async getClassBy(params: Partial<ClassEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.findOne({ where: { ...params, isActive: true } });

    return result;
  }

  async createMapClassToUser(body: ICreateClassUserMapSchema, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: body.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await userClassMapService.createMapUserWithClass(body, options);
  }

  async updateMapClassToUser(params: { classUserMapId: number; classId: number }, body: IUpdateClassUserMapSchema, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: params.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await userClassMapService.updateMapUserWithClass(
      { classId: params.classId, classUserMapId: params.classUserMapId },
      { userId: body.userId },
      options
    );
  }

  async removeMapClassToUser(params: { classUserMapId: number; classId: number }, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: params.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await userClassMapService.removeMapUserWithClass({ classUserMapId: params.classUserMapId, classId: params.classId }, options);
  }

  async createClassTriggerTime(body: ICreateClassTriggerTimeSchema, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: body.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await classTimeMapService.createClassTriggerTime(body, options);
  }

  async updateClassTriggerTime(params: { classTriggerMapId: number; classId: number }, body: IUpdateClassTriggerTimeSchema, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: params.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await classTimeMapService.updateClassTriggerTime(
      { classTriggerMapId: params.classTriggerMapId, classId: params.classId },
      { classTriggerDateTime: body.classTriggerDateTime },
      options
    );
  }

  async removeClassTriggerTime(params: { classTriggerMapId: number; classId: number }, options?: IServiceOptions) {
    const _class = await this.getClassBy({ id: params.classId }, options);
    if (!_class) throw new CustomError('Class not found', 400);

    return await classTimeMapService.removeClassTriggerTime({ classTriggerMapId: params.classTriggerMapId, classId: params.classId }, options);
  }
}
