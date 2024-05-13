import { NotificationEntity } from './entity';
import { BaseRepository } from '../../shared/base/repository';

export default class notificationRepository extends BaseRepository<NotificationEntity> {
  constructor() {
    super(NotificationEntity);
  }
}
