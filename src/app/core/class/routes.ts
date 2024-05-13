import { Router } from 'express';
import { classController } from '.';
import { authenticate, validate } from '../../middlewares';
import {
  createClassTriggerTime,
  createClassUserMap,
  createClassValidation,
  updateClassTriggerTime,
  updateClassUserMap,
  updateClassValidation,
} from './validation';

const classRouter = Router();

classRouter.get('', authenticate, classController.find);
classRouter.get('/user-map', authenticate, classController.findAllClassUserMap);
classRouter.get('/trigger-time', authenticate, classController.findAllClassTriggerTime);

classRouter.get('/:id', authenticate, classController.findOneById);
classRouter.get('/user-map/:id', authenticate, classController.findClassUserMapById);
classRouter.get('/trigger-time/:id', authenticate, classController.findClassTriggerTimeById);

classRouter.post('/', authenticate, validate(createClassValidation), classController.createClass);
//POST -> class/create-class-user-map
classRouter.post('/create-class-user-map', authenticate, validate(createClassUserMap), classController.createClassUserMap);
//POST -> class/create-class-trigger-time
classRouter.post('/create-class-trigger-time', authenticate, validate(createClassTriggerTime), classController.createClassTriggerTime);

classRouter.put('/:id', authenticate, validate(updateClassValidation), classController.updateOne);
//PUT -> class/:id/class-user-map/:classUserMapId
classRouter.put('/:classId/class-user-map/:classUserMapId', authenticate, validate(updateClassUserMap), classController.updateClassUserMap);
//PUT -> class/:id/class-trigger-time/:classTriggerMapId
classRouter.put('/:classId/class-trigger-time/:classTriggerMapId', authenticate, validate(updateClassTriggerTime), classController.updateClassTriggerTime);

classRouter.delete('/:id', authenticate, classController.deleteOne);
//DELETE -> class/:id/class-user-map/:classUserMapId
classRouter.delete('/:classId/class-user-map/:classUserMapId', authenticate, classController.removeMapUserWithClass);
//DELETE -> class/:id/class-trigger-time/:classTriggerMapId
classRouter.delete('/:classId/class-trigger-time/:classTriggerMapId', authenticate, classController.removeClassTriggerTime);

export default classRouter;
