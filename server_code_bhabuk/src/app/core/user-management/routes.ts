import { Router } from 'express';
import { userController } from '.';
import { authenticate, validate } from '../../middlewares';
import {
  registerUserValidation,
  updateUserPasswordValidation,
  updateUserProfileValidation,
  createUserValidation,
  forgotPasswordValidation,
  forgotPasswordOtpGenerationValidation,
} from './validation';

const userRouter = Router();

userRouter.get('/', authenticate, userController.find);
userRouter.get('/associate-class-with-trigger-time', authenticate, userController.fetchUserAssociateClassWithTriggerTime);

userRouter.get('/:id', authenticate, userController.findOneById);

userRouter.post('/', authenticate, validate(createUserValidation as any), userController.createUser);
userRouter.post('/register', validate(registerUserValidation as any), userController.registerUser);
userRouter.post('/forgot-password', validate(forgotPasswordValidation as any), userController.forgotPassword);
userRouter.post('/forgot-password-otp-generation', validate(forgotPasswordOtpGenerationValidation), userController.forgotPasswordOtpGeneration);

userRouter.patch('/update-profile', authenticate, validate(updateUserProfileValidation), userController.updateProfile);
userRouter.patch('/:id', authenticate, validate(updateUserProfileValidation), userController.updateInfo);

userRouter.put('/update-password', authenticate, validate(updateUserPasswordValidation as any), userController.updatePassword);

userRouter.delete('/:id', authenticate, userController.deleteOne);

export default userRouter;
