import ChatService from './service';
import { BaseController, NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../../shared';

export default class ChatController extends BaseController {
  constructor(
    protected service: ChatService,
    protected module: ProjectModule
  ) {
    super(service, module);
  }

  createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createChat(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
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

  findLatestChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.findLatestChat(req.query, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_VIEW_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.findOneById(req.params, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_VIEW_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };
}
