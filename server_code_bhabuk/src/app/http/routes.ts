import express from 'express';
import authRouter from '../core/auth/routes';
import chatRouter from '../core/chat/routes';
import { authenticate } from '../middlewares';
import classRouter from '../core/class/routes';
import locationRouter from '../core/location/routes';
import userRouter from '../core/user-management/routes';
import notificationRouter from '../core/notification/routes';

const appRouter = express.Router();

appRouter.get('/health-check', (req, res) => {
  res.json({ timestamp: new Date(), message: 'Hello from danys server' });
});

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/locations', locationRouter);
appRouter.use('/classes', classRouter);
appRouter.use('/notifications', notificationRouter);
appRouter.use('/chats', authenticate, chatRouter);

export { appRouter };
