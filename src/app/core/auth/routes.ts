import { Router } from 'express';
import { authController } from '.';
import { validate } from '../../middlewares';
import { loginValidation } from './validation';

const authRouter = Router();

authRouter.post('/login', validate(loginValidation), authController.login);

export default authRouter;
