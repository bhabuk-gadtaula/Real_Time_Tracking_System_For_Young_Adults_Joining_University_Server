import { Router } from 'express';
import { notificationController } from '.';
import { validate } from '../../middlewares';
import { createNotificationValidation } from './validation';

const notificationRouter = Router();

notificationRouter.post('/', validate(createNotificationValidation), notificationController.createNotification);

notificationRouter.get('/', notificationController.find);

notificationRouter.get('/:id', notificationController.findOneById);

export default notificationRouter;
