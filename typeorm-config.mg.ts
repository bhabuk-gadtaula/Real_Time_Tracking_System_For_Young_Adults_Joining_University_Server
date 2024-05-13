import { DataSource } from 'typeorm';
import { configService } from './src/config';

export default new DataSource({
  type: 'postgres',
  host: configService.getDbConfigs.host,
  port: configService.getDbConfigs.port,
  username: configService.getDbConfigs.username,
  password: configService.getDbConfigs.password,
  database: configService.getDbConfigs.dbName,
  entities: ['src/**/entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});
