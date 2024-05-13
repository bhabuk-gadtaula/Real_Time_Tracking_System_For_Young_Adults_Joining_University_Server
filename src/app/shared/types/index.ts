import { IAuthUser } from '../interface';
import { IncomingHttpHeaders } from 'http2';
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

export type IAuth = Omit<IAuthUser, 'security'>;
export type AnyObj<T = any> = { [key: string]: T };

export interface RequestHeaders extends IncomingHttpHeaders {}

export type Request = ExpressRequest & {
  authUser?: IAuth;
  headers: RequestHeaders;
  refreshTokenPayload?: IRefreshTokenPayload;
};

export interface IRefreshTokenPayload {
  _id: string;
}

export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;

export type TAlgorithm = Algorithm;

export type TBufferEncoding = BufferEncoding;

export type Nullable<T> = T | null;

export type MiddlewareType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export * from './function-type';
