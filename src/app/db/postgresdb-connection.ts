import { DataSource } from 'typeorm';
import { logger, sleep } from '../shared';
import postgresDbDataSource from './postgresdb-data-source';

class PostgresConnection {
  private dataSource: DataSource | null = null;
  private retryCount = 0;

  constructor() {
    this.dataSource = postgresDbDataSource;
  }

  async init(): Promise<void> {
    try {
      if (!this?.dataSource) {
        logger.error('Could not connect to DB.');
        process.exit(1);
      }

      await this.dataSource.initialize();
      logger.info('DB connected successfully!');

      return;
    } catch (error: any) {
      logger.info(`Could not connect at attempt: ${this.retryCount + 1}`);
      logger.error(error?.message, error);
      if (this.retryCount < 5) {
        this.retryCount++;
        await sleep(5000);
        logger.info('Retry Db connection');

        await this.init();

        return;
      } else {
        logger.error('Could not connect to DB.', error as any);
        process.exit(1);
      }
    }
  }

  public get dbInstance(): DataSource {
    return this.dataSource as DataSource;
  }
}

export default new PostgresConnection();
