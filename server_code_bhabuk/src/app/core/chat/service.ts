import { ChatEntity } from './entity';
import ChatRepository from './repository';
import { IFindQueryParams } from './interface';
import { socketHelper } from '../../../server';
import { ICreateChatValidationSchema } from './validation';
import { Assigner, BaseService, IServiceOptions, ProjectTableName, assigner } from '../../shared';

export default class ChatService extends BaseService<ChatEntity> {
  constructor(protected repository: ChatRepository) {
    super(repository);
  }

  async createChat(body: ICreateChatValidationSchema, options?: IServiceOptions) {
    const payload = {
      ...body,
      createdBy: options.authUser.id,
      updatedBy: options.authUser.id,
    } as ChatEntity;

    const insertedData = await super.create(payload);

    // await firebaseHelper.sendMessage();
    const result = await this.findOneById({ id: insertedData.id }, options);
    socketHelper.sendChatMessage(result);

    return result;
  }

  async find(query: IFindQueryParams, options?: IServiceOptions) {
    console.log(query?.sender?.replace(/ /g, '+'))
    if (!query?.sender || !query?.receiver) return { rows: [], count: 0 };

    const result = await this.repository.model.query(
      `
        select
          id,
          message,
          sender,
          receiver,
          ${assigner(ProjectTableName.CHAT, Assigner.CREATED)},
          ${assigner(ProjectTableName.CHAT, Assigner.UPDATED)}
        from chat
        where is_active = true and sender=$1 and receiver=$2;
      `,
      [query?.sender?.replace(/ /g, '+'), query?.receiver?.replace(/ /g, '+')]
    );

    return { rows: result, count: result.length };
  }

  async findLatestChat(query: IFindQueryParams, options?: IServiceOptions) {
    if (!query?.sender || !query?.receiver) return null;

    const result = await this.repository.model.query(
      `
        select
          id,
          message,
          sender,
          receiver,
          ${assigner(ProjectTableName.CHAT, Assigner.CREATED)},
          ${assigner(ProjectTableName.CHAT, Assigner.UPDATED)}
        from chat
        where is_active = true and sender=$1 and receiver=$2
        order by created_at desc
        limit 1;
      `,
      [query.sender, query.receiver]
    );

    return result.length ? result[0] : null;
  }

  async findOneById(params: Partial<ChatEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          id,
          message,
          sender,
          receiver,
          ${assigner(ProjectTableName.CHAT, Assigner.CREATED)},
          ${assigner(ProjectTableName.CHAT, Assigner.UPDATED)}
        from chat
        where id = $1 and is_active = true;
      `,
      [params.id]
    );

    return result.length ? result[0] : null;
  }
}
