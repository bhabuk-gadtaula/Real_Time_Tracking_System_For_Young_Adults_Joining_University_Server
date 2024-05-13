import { logger } from '.';

export default class SocketHelper {
  constructor(private socketIoServer: any) {
    this.socketIoServer.on('connection', (socket: any) => {
      logger.debug('[Connected]');
      socket.on('connected', () => {
        logger.debug('User connected');
      });

      socket.on('disconnect', () => {
        logger.debug('user disconnected');
      });
    });
  }

  sendChatMessage(message: any) {
    this.socketIoServer.emit('message', message);
  }
}
