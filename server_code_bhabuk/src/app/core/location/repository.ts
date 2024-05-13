import { LocationEntity } from './entity';
import { BaseRepository } from '../../shared/base/repository';

export default class LocationRepository extends BaseRepository<LocationEntity> {
  constructor() {
    super(LocationEntity);
  }
}
