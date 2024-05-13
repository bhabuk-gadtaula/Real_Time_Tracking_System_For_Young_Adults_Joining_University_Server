import { CommonEntity } from './entity';
import { BaseService } from './service';
import { NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../';

export abstract class BaseController<EntityType extends CommonEntity = any> {
  constructor(
    protected service: BaseService<EntityType>,
    protected module: ProjectModule
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };
}
