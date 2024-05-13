import dotenv from 'dotenv';
import { envSchema } from './validations';
import { validateConfig } from './config-validation';
import { EnvConfiguration, IAppConfig, IConfigService, IDbConfig, IEncryptionConfig, IJwtConfig, IMailConfig } from './interfaces';

class ConfigService implements IConfigService {
  private envData: EnvConfiguration;

  constructor() {
    this.envData = validateConfig<EnvConfiguration<typeof envSchema>>(this.parsedEnv, envSchema);
  }

  get getAppConfigs(): IAppConfig {
    return {
      port: this.envData?.PORT,
      env: this.envData?.NODE_ENV,
      isDebug: this.parseBoolean(this.envData?.DEBUG),
      corsWhitelist: this.envData?.CORS_WHITELIST,
    };
  }

  get getJwtConfig(): IJwtConfig {
    return { secret: this.envData?.JWT_SECRET };
  }

  get getDbConfigs(): IDbConfig {
    return {
      port: this.envData?.POSTGRES_DB_PORT,
      dbName: this.envData?.POSTGRES_DB_NAME,
      host: this.envData?.POSTGRES_HOST_NAME,
      username: this.envData?.POSTGRES_USERNAME,
      password: this.envData?.POSTGRES_PASSWORD,
    };
  }

  get getEncryptionConfig(): IEncryptionConfig {
    return { algorithm: this.envData?.ENCRYPTION_ALGORITHM, secret: this.envData?.ENCRYPTION_SECRET, vector: this.envData?.ENCRYPTION_VECTOR };
  }

  get getMailConfig(): IMailConfig {
    return { email: this.envData?.MAIL_EMAIL, password: this.envData?.MAIL_PASSWORD };
  }

  private get parsedEnv() {
    return { ...dotenv.config().parsed };
  }

  private parseBoolean(booleanString?: string): boolean {
    if (!booleanString) return false;

    return booleanString.toLowerCase() === 'true' || booleanString.toLowerCase() == '1' ? true : false;
  }
}

export default new ConfigService();
