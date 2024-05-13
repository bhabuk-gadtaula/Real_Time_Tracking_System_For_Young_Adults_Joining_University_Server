import LocationService from './service';
import { BaseController, NextFunction, ProjectModule, Request, Response, formatCommonModelMessage, success, successMessage } from '../../shared';

export default class LocationController extends BaseController {
  constructor(
    protected service: LocationService,
    protected module: ProjectModule
  ) {
    super(service, module);
  }
  // child ko location aako xaiana map bata
  // lat ra longitude ulto bhako xa
  // notification ma child nam ko aako xaina
  // child lai bato dekhaunu paryo euta matrai bato  [IMP]
  // class time aghi notification [check garera verify]
  // dekhako bato ma gayena bhane notification jane hunu paryo

  addLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.addLocation(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  calculateDistance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.calculateDistance(req.body, { authUser: req.authUser });
      res.send(success(data, 'Distance calculated successfully'));
    } catch (error: any) {
      next(error);
    }
  };

  addUserLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.addUserLocation(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage(successMessage.MODEL_CREATE_SUCCESS, this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateMyLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateMyLocation(req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('User location update successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  updateLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateLocation(req.params, req.body, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Location update successfully', this.module)));
    } catch (error: any) {
      next(error);
    }
  };

  removeLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.removeLocation(req.params, { authUser: req.authUser });
      res.send(success(data, formatCommonModelMessage('Location deleted successfully', this.module)));
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
}
