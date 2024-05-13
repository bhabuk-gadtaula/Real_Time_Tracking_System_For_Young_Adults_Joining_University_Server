import { NotificationEntity } from './entity';
import { IFindQueryParams } from './interface';
import NotificationRepository from './repository';
import { ICreateClassValidationSchema } from './validation';
import { calculatePagination } from '../../shared/utils/pagination';
import { Assigner, assigner, BaseService, IServiceOptions, ProjectTableName } from '../../shared';

export default class NotificationService extends BaseService<NotificationEntity> {
  constructor(protected repository: NotificationRepository) {
    super(repository);
  }

  async createNotification(data: ICreateClassValidationSchema, options?: IServiceOptions) {
    const payload: any = {
      ...data,
      createdBy: options.authUser.id,
      updatedBy: options.authUser.id,
    };

    const insertedData = await super.create({ ...payload });

    return await this.findOneById({ id: insertedData.id }, options);
  }

  async findOneById(params: Partial<NotificationEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          notification.id as id,
              notification.note as note,
              notification.project_module as projectModule,
              json_build_object(
                  'userId', users.id,
                  'fullName', (
                      select
                          CONCAT(
                              users.first_name,
                              CASE
                                WHEN users.middle_name IS NOT NULL THEN ' ' || users.middle_name
                                ELSE ''
                              END,
                              ' ',
                              users.last_name
                        ) as fullName
                      ),
                  'email', users.email
              ) as assigner,
          ${assigner(ProjectTableName.NOTIFICATION, Assigner.CREATED)},
          ${assigner(ProjectTableName.NOTIFICATION, Assigner.UPDATED)}
        from notification
        inner join users
        on users.id = notification.assigner and users.status = 'ACTIVE'
        where notification.id=$1;
      `,
      [params.id]
    );

    return result.length ? result[0] : null;
  }

  async find(query: IFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);

    const result = await this.repository.model.query(
      `
        select
          notification.id as id,
              notification.note as note,
              notification.project_module as projectModule,
              json_build_object(
                  'userId', users.id,
                  'fullName', (
                      select
                          CONCAT(
                              users.first_name,
                              CASE
                                WHEN users.middle_name IS NOT NULL THEN ' ' || users.middle_name
                                ELSE ''
                              END,
                              ' ',
                              users.last_name
                        ) as fullName
                      ),
                  'email', users.email
              ) as assigner,
          ${assigner(ProjectTableName.NOTIFICATION, Assigner.CREATED)},
          ${assigner(ProjectTableName.NOTIFICATION, Assigner.UPDATED)}
        from notification
        inner join users
        on users.id = notification.assigner and users.status = 'ACTIVE'
        offset $1
        limit $2;
      `,
      [offset, limit]
    );

    return { rows: result, count: result.length };
  }
}
