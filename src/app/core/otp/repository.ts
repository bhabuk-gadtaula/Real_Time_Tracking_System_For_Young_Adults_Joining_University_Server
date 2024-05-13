import { OtpEntity } from './entity';
import { BaseRepository } from '../../shared';

export default class OtpRepository extends BaseRepository<OtpEntity> {
  constructor() {
    super(OtpEntity);
  }
}
