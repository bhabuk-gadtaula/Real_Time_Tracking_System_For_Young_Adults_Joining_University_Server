import ChatService from './service';
import ChatController from './controller';
import ChatRepository from './repository';
import { ProjectModule } from '../../shared';

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService, ProjectModule.CLASS);

export { chatController, chatRepository, chatService };
