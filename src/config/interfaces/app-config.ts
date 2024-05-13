// import { Environment } from '../../app';

export interface IAppConfig {
  port: number;
  env: string;
  isDebug?: boolean;
  corsWhitelist: string;
}
