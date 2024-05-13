import 'reflect-metadata';
import { initialize } from './app';
import { ApplicationBootstrap } from './app/shared';
import SocketHelper from './app/shared/helpers/socket-helper';

const application = new ApplicationBootstrap();

async function startServer() {
  await application.init(initialize);
}

startServer();

export const socketHelper = application.socket && new SocketHelper(application?.socket);
