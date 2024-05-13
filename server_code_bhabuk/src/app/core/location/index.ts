import LocationService from './service';
import { ProjectModule } from '../../shared';
import LocationController from './controller';
import LocationRepository from './repository';

const locationRepository = new LocationRepository();
const locationService = new LocationService(locationRepository);
const locationController = new LocationController(locationService, ProjectModule.LOCATION);

export * from './interface';
export { locationController, locationService };
