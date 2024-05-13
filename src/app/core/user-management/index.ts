import UserService from './service';
import UserRepository from './repository';
import UserController from './controller';
import { ProjectModule } from '../../shared';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService, ProjectModule.USER);

export * from './interface';
export { userController, userService, userRepository };
