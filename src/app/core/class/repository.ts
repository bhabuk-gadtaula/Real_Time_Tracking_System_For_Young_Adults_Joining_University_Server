import { ClassEntity } from './entity';
import { BaseRepository } from '../../shared/base/repository';

export default class ClassRepository extends BaseRepository<ClassEntity> {
  constructor() {
    super(ClassEntity);
  }
}
