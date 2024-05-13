import AuthService from './service';
import AuthController from './controller';
import { userService } from '../user-management';

const authService = new AuthService(userService);
const authController = new AuthController(authService);

export { authController, authService };
