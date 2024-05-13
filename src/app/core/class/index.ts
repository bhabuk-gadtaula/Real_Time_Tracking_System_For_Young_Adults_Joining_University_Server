import ClassService from './service';
import ClassController from './controller';
import ClassRepository from './repository';
import { ProjectModule } from '../../shared';

const classRepository = new ClassRepository();
const classService = new ClassService(classRepository);
const classController = new ClassController(classService, ProjectModule.CLASS);

export * from './interface';
export { classController, classRepository, classService };
