export enum LogType {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface ILogger {
  info(message: string, obj?: { [key: string]: any }): void;
  warn(message: string, obj?: { [key: string]: any }): void;
  error(message: string, obj?: { [key: string]: any }): void;
  debug(message: string, obj?: { [key: string]: any }): void;
}
