import { AnyObj } from '../../types';
import { AxiosRequestConfig } from 'axios';
import { IAuthUser } from '../../interface/auth-user';

export interface IAuthRequestOptions extends AxiosRequestConfig {
  authUser?: IAuthUser;
}

export interface IHttpRequest {
  get(urlSuffix: string, options?: IAuthRequestOptions): Promise<any>;
  post(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions): Promise<any>;
  put(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions): Promise<any>;
  delete(urlSuffix: string, options?: IAuthRequestOptions): Promise<any>;
  patch(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions): Promise<any>;
}
