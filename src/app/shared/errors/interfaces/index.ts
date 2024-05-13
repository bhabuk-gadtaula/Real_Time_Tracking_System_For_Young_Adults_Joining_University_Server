import { AnyObj } from '../../types';

export interface IError extends Error {
  statusCode: number;
}

export interface ErrorResponse {
  message: string;
  code: number | string;
  data?: AnyObj;
}
