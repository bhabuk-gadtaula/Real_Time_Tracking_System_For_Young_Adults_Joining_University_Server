import { LocationEntity } from './entity';
import { classRepository } from '../class';
import LocationRepository from './repository';
import { IFindQueryParams } from './interface';
import { notificationService } from '../notification';
import { calculatePagination } from '../../shared/utils/pagination';
import { UserRole, UserStatus, userRepository, userService } from '../user-management';
import { Assigner, BaseService, CustomError, IServiceOptions, ProjectModule, ProjectTableName, assigner, getDistance, getFullName } from '../../shared';
import {
  ICreateLocationUserValidationSchema,
  ICreateLocationValidationSchema,
  IDistanceCalculationValidationSchema,
  IUpdateLocationValidationSchema,
  IUpdateMyLocationValidationSchema,
} from './validation';

export default class LocationService extends BaseService<LocationEntity> {
  constructor(protected repository: LocationRepository) {
    super(repository);
  }

  async addLocation(body: ICreateLocationValidationSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child user permission denied!', 400);
    const location = await this.getLocationBy(
      { referenceId: body.referenceId, isActive: true, moduleName: body.moduleName, userParentId: options?.authUser?.parentId },
      options
    );
    if (location) throw new CustomError('Location already exists', 400);

    const payload: LocationEntity = {
      sourceLat: body.source.latitude,
      sourceLong: body.source.longitude,
      referenceId: body.referenceId,
      moduleName: body.moduleName,
      createdBy: options?.authUser?.id,
      updatedBy: options?.authUser?.id,
      userParentId: options?.authUser?.id,
    };

    const insertedData = await super.create(payload);

    console.log('data', options);

    // await notificationService.createNotification({
    //   note: `${body.moduleName} location of latitude: ${body.source.latitude} and longitude: ${body.source.longitude} of reference: ${body.referenceId} is created successfully`,
    //   assigner: options?.authUser?.parentId,
    //   moduleName: ProjectModule.CLASS,
    // });

    return await this.findOneById({ id: insertedData.id }, options);
  }

  async addUserLocation(body: ICreateLocationUserValidationSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child user is not allowed', 400);

    const user = await userService.findOneBy({ id: body.referenceId, ancestorId: options?.authUser?.parentId, status: UserStatus.ACTIVE });
    if (!user) throw new CustomError('User not found', 400);

    // if (!(user.role !== UserRole.CHILD)) throw new CustomError('Parent user cannot set role to other parent user', 400);

    if (user.role === UserRole.CHILD && !body?.destination) throw new CustomError('Child user must have destination location', 400);

    const location = await this.getLocationBy({ referenceId: body.referenceId, isActive: true, moduleName: ProjectModule.USER }, options);
    if (location) throw new CustomError('Location of user already exists', 400);

    const payload: LocationEntity = {
      sourceLat: body.source.latitude,
      sourceLong: body.source.longitude,
      referenceId: body.referenceId,
      moduleName: ProjectModule.USER,
      createdBy: options?.authUser?.id,
      updatedBy: options?.authUser?.id,
      userParentId: options?.authUser?.id,

      ...(body?.destination?.latitude && { destLat: body.destination.latitude }),
      ...(body?.destination?.longitude && { destLong: body.destination.longitude }),
    };

    const insertedData = await super.create(payload);

    return await this.findOneById({ id: insertedData.id }, options);
  }

  async updateLocation(params: Partial<LocationEntity>, body: IUpdateLocationValidationSchema, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child user is not allowed', 400);
    const location = await this.repository.model.findOne({
      where: { id: params.id, isActive: true, userParentId: options?.authUser?.parentId },
      select: ['id', 'referenceId', 'moduleName'],
    });
    if (!location) throw new CustomError('Location not found', 400);

    if (body.moduleName !== location.moduleName) throw new CustomError('location module mismatch', 400);

    let updatedPayload = {
      updatedBy: options?.authUser?.id,
      updatedAt: new Date(),
    } as LocationEntity;

    if (location.moduleName === ProjectModule.USER) {
      const user = await userService.findOneBy({ id: body.referenceId, status: UserStatus.ACTIVE });
      if (!user) throw new CustomError('User not found', 400);
      updatedPayload = {
        ...updatedPayload,
        sourceLat: body.source.latitude,
        sourceLong: body.source.longitude,
        ...(body?.destination?.latitude && user.role === UserRole.CHILD && { destLat: body.destination.latitude }),
        ...(body?.destination?.longitude && user.role === UserRole.CHILD && { destLong: body.destination.longitude }),
      };
    } else {
      updatedPayload = {
        ...updatedPayload,
        sourceLat: body.source.latitude,
        sourceLong: body.source.longitude,
      };
    }

    await this.repository.model.update({ id: location.id }, updatedPayload);

    return await this.findOneById({ id: location.id }, options);
  }

  async updateMyLocation(body: IUpdateMyLocationValidationSchema, options?: IServiceOptions) {
    const location = await this.repository.model.findOne({
      where: { referenceId: options.authUser.id, isActive: true },
      select: ['id', 'referenceId', 'moduleName'],
    });
    if (!location) throw new CustomError('Location not found', 400);

    const updatedPayload = {
      updatedBy: options?.authUser?.id,
      updatedAt: new Date(),
      sourceLat: body.source.latitude,
      sourceLong: body.source.longitude,
      ...(body?.destination?.latitude && options.authUser.role === UserRole.CHILD && { destLat: body.destination.latitude }),
      ...(body?.destination?.longitude && options.authUser.role === UserRole.CHILD && { destLong: body.destination.longitude }),
    } as LocationEntity;

    await this.repository.model.update({ id: location.id }, updatedPayload);

    return await this.findOneById({ id: location.id }, options);
  }

  async removeLocation(params: Partial<LocationEntity>, options?: IServiceOptions) {
    if (options?.authUser?.role === UserRole.CHILD) throw new CustomError('Child user is not allowed', 400);
    const location = await this.repository.model.findOne({
      where: { id: params.id, isActive: true, userParentId: options?.authUser?.parentId },
      select: ['id'],
    });
    if (!location) throw new CustomError('Location not found', 400);

    const updatedPayload = {
      deletedBy: options?.authUser?.id,
      deletedAt: new Date(),
      isActive: false,
    } as LocationEntity;

    await this.repository.model.update({ id: location.id }, updatedPayload);

    return await this.findOneById({ id: location.id }, options);
  }

  async findOneById(params: Partial<LocationEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.query(
      `
        select
          id,
          json_build_object('latitude', source_lat, 'longitude', source_long) as "source",
          json_build_object('latitude', dest_lat, 'longitude', dest_long) as "destination",
          ${assigner(ProjectTableName.LOCATION, Assigner.CREATED)},
          ${assigner(ProjectTableName.LOCATION, Assigner.UPDATED)},
          json_build_object('referenceId', reference_id, 'moduleName', project_module) as "reference"
        from locations
        where id = $1 and is_active = true and locations.user_parent_id = $2;
      `,
      [params.id, options?.authUser?.parentId]
    );

    return result.length ? result[0] : null;
  }

  async getLocationBy(params: Partial<LocationEntity>, options?: IServiceOptions) {
    const result = await this.repository.model.findOne({ where: { ...params, isActive: true } });

    return result;
  }

  async find(query: IFindQueryParams, options?: IServiceOptions) {
    const { limit, offset } = calculatePagination(query);

    const result = await this.repository.model.query(
      `
        select
          id,
          json_build_object('latitude', source_lat, 'longitude', source_long) as "source",
          json_build_object('latitude', dest_lat, 'longitude', dest_long) as "destination",
          ${assigner(ProjectTableName.LOCATION, Assigner.CREATED)},
          ${assigner(ProjectTableName.LOCATION, Assigner.UPDATED)},
          json_build_object('referenceId', reference_id, 'moduleName', project_module) as "reference"
        from locations
        where is_active = true and locations.user_parent_id = $3
        offset $1
        limit $2;;
      `,
      [offset, limit, options?.authUser?.parentId]
    );

    return { rows: result, count: result.length };
  }

  async calculateDistance(body: IDistanceCalculationValidationSchema, options?: IServiceOptions) {
    const fetchClass = await classRepository.model.findOne({ where: { id: body.classId } });
    if (!fetchClass) throw new CustomError('Class not found', 400);

    const fetchLocationOfClass = await this.repository.model.findOne({ where: { referenceId: body.classId, moduleName: ProjectModule.CLASS } });

    const distanceCalculate = getDistance(
      { long: fetchLocationOfClass?.sourceLong, lat: fetchLocationOfClass?.sourceLat },
      { long: body?.userGeoLocation.long, lat: body?.userGeoLocation?.lat }
    );

    // const distanceCalculate = getDistance({ long: -122.451565, lat: 37.78229 }, { long: body?.userGeoLocation.long, lat: body?.userGeoLocation?.lat });

    if (distanceCalculate <= 500) {
      await notificationService.createNotification(
        {
          note: `${getFullName({ firstName: options?.authUser?.firstName, lastName: options?.authUser?.lastName, middleName: options?.authUser?.middleName })} user is on ${parseFloat(distanceCalculate.toFixed(3))} meter of class ${fetchClass.name}`,
          moduleName: ProjectModule.LOCATION,
          assigner: options?.authUser?.parentId,
        },
        options
      );
    }

    return {
      distance: parseFloat(distanceCalculate.toFixed(3)),
      user: {
        id: options?.authUser?.id,
        firstName: options?.authUser?.firstName,
        lastName: options?.authUser?.lastName,
        middleName: options?.authUser?.middleName,
        email: options?.authUser?.email,
        location: {
          longitude: body?.userGeoLocation?.long,
          latitude: body?.userGeoLocation?.lat,
        },
      },
      class: {
        id: fetchClass.id,
        name: fetchClass.name,
        location: {
          source: {
            longitude: fetchLocationOfClass.sourceLong,
            latitude: fetchLocationOfClass.sourceLat,
          },
        },
      },
    };
  }
}
