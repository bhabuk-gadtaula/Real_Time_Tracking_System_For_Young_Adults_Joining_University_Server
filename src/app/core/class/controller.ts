import ClassService from './service';
import { classTimeMapService, userClassMapService } from '../user-class-time-map';
import { BaseController, NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../../shared';

export default class ClassController extends BaseController {
  constructor(
    protected service: ClassService,
    protected module: ProjectModule
  ) {
    super(service, module);
  }

  createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createClass(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateOne(req.params, req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_UPDATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.deleteOne(req.params, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_DELETE_SUCCESS, this.module)));
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

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.find(req.query, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_FETCH_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  createClassUserMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userClassMapService.createMapUserWithClass(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Class user map created successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateClassUserMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userClassMapService.updateMapUserWithClass({ classId: +req.params?.classId, classUserMapId: +req.params?.classUserMapId }, req.body, {
        authUser: req.authUser,
      });
      res.send(success(data, formatCommonModelMessage('Class user map updated successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  removeMapUserWithClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userClassMapService.removeMapUserWithClass(
        { classId: +req.params?.classId, classUserMapId: +req.params?.classUserMapId },
        {
          authUser: req.authUser,
        }
      );
      res.send(success(data, formatCommonModelMessage('Class user map deleted successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  createClassTriggerTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classTimeMapService.createClassTriggerTime(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Class trigger time created successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateClassTriggerTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classTimeMapService.updateClassTriggerTime(
        { classId: +req.params?.classId, classTriggerMapId: +req.params?.classTriggerMapId },
        req.body,
        {
          authUser: req.authUser,
        }
      );
      res.send(success(data, formatCommonModelMessage('Class trigger time updated successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  removeClassTriggerTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classTimeMapService.removeClassTriggerTime(
        { classId: +req.params?.classId, classTriggerMapId: +req.params?.classTriggerMapId },
        {
          authUser: req.authUser,
        }
      );
      res.send(success(data, formatCommonModelMessage('Class trigger time deleted successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findAllClassUserMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userClassMapService.fetchUserClasses(req.query, {
        authUser: req.authUser,
      });
      res.send(success(data, formatCommonModelMessage('Class user map list fetch successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findClassUserMapById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userClassMapService.fetchUserClassId(req.params, {
        authUser: req.authUser,
      });
      res.send(success(data, formatCommonModelMessage('Class user map detail fetch successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findAllClassTriggerTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classTimeMapService.fetchClassesTriggerTime(req.query, {
        authUser: req.authUser,
      });
      res.send(success(data, formatCommonModelMessage('Class trigger time list fetch successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  findClassTriggerTimeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classTimeMapService.fetchClassTriggerTimeById(req.params, {
        authUser: req.authUser,
      });
      res.send(success(data, formatCommonModelMessage('Class trigger time detail fetch successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };
}
