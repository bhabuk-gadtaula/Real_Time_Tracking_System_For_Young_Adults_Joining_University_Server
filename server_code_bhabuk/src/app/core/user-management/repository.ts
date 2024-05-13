import { UsersEntity } from './entity';
import { BaseRepository } from '../../shared/base/repository';

export default class UserRepository extends BaseRepository<UsersEntity> {
  constructor() {
    super(UsersEntity);
  }
}
