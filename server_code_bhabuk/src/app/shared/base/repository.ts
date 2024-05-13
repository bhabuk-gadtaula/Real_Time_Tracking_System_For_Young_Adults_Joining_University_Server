import { CommonEntity } from './entity';
import { postgresConnection } from '../../db';
import { EntityTarget, Repository } from 'typeorm';

export abstract class BaseRepository<ModelSchema extends CommonEntity> {
  public model: Repository<ModelSchema>;
  constructor(protected entity: EntityTarget<ModelSchema>) {
    this.model = postgresConnection.dbInstance.getRepository(entity);
  }

  async create(body: ModelSchema) {
    const resource = await this.model.save(body);

    return resource;
  }
}
