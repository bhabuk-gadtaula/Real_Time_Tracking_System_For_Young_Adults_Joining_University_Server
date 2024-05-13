import { BaseRepository } from '../../shared/base/repository';
import { ClassTimeMappingEntity, UserClassMappingEntity } from './entity';

export class UserClassMapRepository extends BaseRepository<UserClassMappingEntity> {
  constructor() {
    super(UserClassMappingEntity);
  }
}

export class ClassTimeMapRepository extends BaseRepository<ClassTimeMappingEntity> {
  constructor() {
    super(ClassTimeMappingEntity);
  }
}
