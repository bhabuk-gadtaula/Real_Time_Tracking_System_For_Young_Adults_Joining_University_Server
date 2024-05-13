import { DataSource } from 'typeorm';
import { configService } from '../../config';
import { OtpEntity } from '../core/otp/entity';
import { ChatEntity } from '../core/chat/entity';
import { ClassEntity } from '../core/class/entity';
import { LocationEntity } from '../core/location/entity';
import { UsersEntity } from '../core/user-management/entity';
import { NotificationEntity } from '../core/notification/entity';
import { ClassTimeMappingEntity, UserClassMappingEntity } from '../core/user-class-time-map/entity';
export default new DataSource({
  type: 'postgres',
  host: configService.getDbConfigs.host,
  port: configService.getDbConfigs.port,
  username: configService.getDbConfigs.username,
  password: configService.getDbConfigs.password,
  database: configService.getDbConfigs.dbName,
  entities: [UsersEntity, OtpEntity, LocationEntity, ClassEntity, ClassTimeMappingEntity, UserClassMappingEntity, ChatEntity, NotificationEntity],
  migrations: ['../../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
