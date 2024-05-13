import NotificationService from './service';
import { ProjectModule } from '../../shared';
import NotificationController from './controller';
import NotificationRepository from './repository';

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService, ProjectModule.CLASS);

export * from './interface';
export { notificationController, notificationRepository, notificationService };
