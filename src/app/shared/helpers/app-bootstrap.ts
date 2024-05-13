import hpp from 'hpp';
import cors from 'cors';
import { logger } from '.';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { CallbackFuncType } from '../types';
import { postgresConnection } from '../../db';
import express, { Application } from 'express';
import { configService } from '../../../config';

export default class ApplicationBootstrap {
  public app: Application;
  public httpServer: any;
  public socket: any;

  constructor() {
    this.handleInitializer();
    this.app = express();
    this.httpServer = createServer(this.app);
    this.socket = new Server(this.httpServer, {
      cors: {
        origin: '*',
      },
    });

    this.processEvent();
  }

  private handleInitializer() {
    logger.init();
  }

  public async init(initializeServiceApp: CallbackFuncType): Promise<void> {
    await this.registerConnection();
    this.registerMiddleware();

    // Initialize service level application middleware
    await initializeServiceApp(this.app);

    //server listening
    this.listen();
  }

  private async registerConnection() {
    //Register Database Connection
    await postgresConnection.init();
  }

  private registerMiddleware() {
    this.app.use(helmet({ hsts: { maxAge: 2592000, includeSubDomains: true, preload: true } }));
    this.app.use(hpp()); //Protect against HTTP Parameter Pollution attacks
    this.app.use(
      cors({
        //origin: configService.getAppConfigs.corsWhitelist.split(',').map(origin => origin.trim()),
        origin: '*',
      })
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private listen() {
    const server = this.httpServer.listen(configService.getAppConfigs.port, () => {
      const { port, address } = <{ address: string; port: number }>server.address();

      logger.info(`🚀🚀 Listening at http://${address}:${port} at ${configService.getAppConfigs.env} 🚀🚀`);
    });
  }

  private processEvent() {
    process
      .on('uncaughtException', err => logger.error('Uncaught Exception thrown', err))
      .on('unhandledRejection', (reason, p) => logger.error(`Unhandled Rejection at Promise [${reason}]`, p));
  }
}
