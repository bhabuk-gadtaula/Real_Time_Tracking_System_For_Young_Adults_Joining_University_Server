import UserService from './service';
import { BaseController } from '../../shared/base/controller';
import { NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../../shared';

export default class UserController extends BaseController {
  constructor(
    protected service: UserService,
    protected module: ProjectModule
  ) {
    super(service, module);
  }

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.register(req.body);
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createProfile(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.findOneById(req.params, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_VIEW_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateProfile(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('User profile update successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateInfo(req.params, req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('User information update successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updatePassword(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('User password update successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.find(req.query, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_FETCH_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.deleteProfile(req.params, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_DELETE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.forgotPassword(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Password reset successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  forgotPasswordOtpGeneration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.forgotPasswordOtpGeneration(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Forget password otp sent successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  fetchUserAssociateClassWithTriggerTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.fetchUserAssociateClassWithTriggerTime({ authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('User associated class with trigger time fetch successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };
}
