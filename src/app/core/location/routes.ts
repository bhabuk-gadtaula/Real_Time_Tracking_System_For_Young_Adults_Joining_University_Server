import { Router } from 'express';
import { locationController } from '.';
import { authenticate, validate } from '../../middlewares';
import {
  createLocationUserValidation,
  createLocationValidation,
  distanceCalculationValidation,
  updateLocationValidation,
  updateMyLocationValidation,
} from './validation';

const locationRouter = Router();

locationRouter.post('/', authenticate, validate(createLocationValidation), locationController.addLocation);
locationRouter.post('/user', authenticate, validate(createLocationUserValidation), locationController.addUserLocation);
locationRouter.post('/calculate-distance', authenticate, validate(distanceCalculationValidation), locationController.calculateDistance);

locationRouter.get('/', authenticate, locationController.find);
locationRouter.get('/:id', authenticate, locationController.findOneById);

locationRouter.put('/my-location', authenticate, validate(updateMyLocationValidation), locationController.updateMyLocation);
locationRouter.put('/:id', authenticate, validate(updateLocationValidation), locationController.updateLocation);

locationRouter.delete('/:id', authenticate, locationController.removeLocation);

export default locationRouter;
