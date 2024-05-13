import { SYSTEM } from '../constants';
import { ProjectModule } from '../enums';
import { ILogger, LogType } from './interfaces';
import { configService } from '../../../config';
import { FileTransportOptions } from 'winston/lib/winston/transports';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';

export default class Logger implements ILogger {
  private logger?: WinstonLogger;
  private openTransportsCount = 0;

  init(logPath: string = 'logs', projectModule: ProjectModule | string = SYSTEM) {
    const { combine, timestamp, label, printf, errors, colorize } = format;

    const customFormat = printf(f => {
      const metaString = f.meta ? `\n ${JSON.stringify(f.meta)}` : '';

      return `${f.timestamp} [${f.label}] [${f.level}] ${f.stack || f.message}${metaString}`;
    });
    const formatLabel = label({ label: projectModule });
    const formatTimestamp = timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });
    const formatError = errors({ stack: true });

    const commonFormat = combine(formatLabel, formatTimestamp, formatError, customFormat, format.splat());

    const fileTransportOption: FileTransportOptions = {
      maxsize: 10000000, //10mb
      maxFiles: 10,
      tailable: true,
      format: combine(commonFormat),
    };

    const consoleLog = new transports.Console({
      handleExceptions: true,
      level: LogType.DEBUG,
      format: combine(colorize({ all: true }), commonFormat),
    });
    const combinedFile = this.createTransportFile({ filename: `${logPath}/logs.log`, ...fileTransportOption });
    const errorFile = this.createTransportFile({ filename: `${logPath}/errors.log`, level: LogType.ERROR, ...fileTransportOption });
    const exceptionFile = new transports.File({ filename: `${logPath}/exceptions.log`, ...fileTransportOption });

    this.logger = createLogger({ transports: [errorFile], exceptionHandlers: [exceptionFile], exitOnError: false });
    this.logger.add(configService.getAppConfigs.isDebug ? consoleLog : combinedFile);
  }

  //Using the openTransportsCount variable to keep track of which 'files transports' are currently open, and once they are all closed, then, and only then, exit the process.
  private fileFinished = () => {
    this.openTransportsCount--;
    if (this.openTransportsCount == 0) process.exit(0);
  };

  private createTransportFile = (fileTransportOption: FileTransportOptions) => {
    const transportFile = new transports.File(fileTransportOption);
    transportFile.on('open', () => {
      this.openTransportsCount++;
    });
    // Access the underlying stream and listen for 'finish' event
    transportFile.on('finish', () => this.fileFinished());

    return transportFile;
  };

  private log(level: string, message: string, meta: any) {
    this.logger ? this.logger.log({ level, message, meta }) : console.log(message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogType.INFO, message, meta);
  }

  error(message: string, meta?: any): void {
    this.log(LogType.ERROR, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogType.WARN, message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log(LogType.DEBUG, message, meta);
  }
}
