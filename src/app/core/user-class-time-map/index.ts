import { ClassTimeMapService, UserClassMapService } from './service';
import { ClassTimeMapRepository, UserClassMapRepository } from './repository';

const userClassMapRepository = new UserClassMapRepository();
const userClassMapService = new UserClassMapService(userClassMapRepository);

const classTimeMapRepository = new ClassTimeMapRepository();
const classTimeMapService = new ClassTimeMapService(classTimeMapRepository);

export * from './interface';
export { userClassMapRepository, userClassMapService, classTimeMapRepository, classTimeMapService };
