import { CommonEntity } from './entity';
import { BaseRepository } from './repository';

export abstract class BaseService<ModelSchema extends CommonEntity> {
  constructor(protected repository: BaseRepository<ModelSchema>) {}

  async create(body: ModelSchema) {
    const created = await this.repository.create(body);

    return created;
  }
}
