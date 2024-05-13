import NotificationService from './service';
import { BaseController, NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../../shared';

export default class NotificationController extends BaseController {
  constructor(
    protected service: NotificationService,
    protected module: ProjectModule
  ) {
    super(service, module);
  }

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.find(req.query, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_FETCH_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createNotification(req.body, { authUser: req.authUser });
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
}
