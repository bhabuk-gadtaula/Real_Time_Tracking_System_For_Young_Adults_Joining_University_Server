import { ChatEntity } from './entity';
import { BaseRepository } from '../../shared/base/repository';

export default class ChatRepository extends BaseRepository<ChatEntity> {
  constructor() {
    super(ChatEntity);
  }
}
