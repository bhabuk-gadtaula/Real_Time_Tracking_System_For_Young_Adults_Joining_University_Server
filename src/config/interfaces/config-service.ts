import { IDbConfig } from './db-config';
import { IAppConfig } from './app-config';
import { IJwtConfig } from './jwt-config';
import { IEncryptionConfig } from './encryption-config';

export interface IConfigService {
  get getAppConfigs(): IAppConfig;

  get getJwtConfig(): IJwtConfig;

  get getDbConfigs(): IDbConfig;

  get getEncryptionConfig(): IEncryptionConfig;
}
