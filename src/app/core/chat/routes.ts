import { Router } from 'express';
import { chatController } from '.';
import { validate } from '../../middlewares';
import { createChatValidation } from './validation';

const chatRouter = Router();

chatRouter.post('', validate(createChatValidation), chatController.createChat);

chatRouter.get('', chatController.find);
chatRouter.get('/latest', chatController.findLatestChat);

chatRouter.get('/:id', chatController.findById);

export default chatRouter;
