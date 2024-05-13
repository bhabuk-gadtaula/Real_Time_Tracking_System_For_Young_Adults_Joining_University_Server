import { logger } from '.';
import { AnyObj } from '../types';
import jwtHelper from './jwt-helper';
import { withoutAttrs } from '../utils';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IAuthRequestOptions, IHttpRequest } from './interfaces';

export default class HttpRequestHelper implements IHttpRequest {
  private axiosClient: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosClient = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  private getHeaderConfig(options?: IAuthRequestOptions): IAuthRequestOptions {
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.authUser && { Cookie: `accessToken=${jwtHelper.generate(withoutAttrs(options.authUser, ['exp', 'iat']))}` }),
    };

    if (options) {
      options.headers = { ...options.headers, ...headers };
    } else {
      options = { headers };
    }

    options.proxy = options.proxy ?? false;

    return options;
  }

  private getResponse(response: AxiosResponse<any, any>) {
    return Object.keys(response.data).includes('data') ? response.data.data : response.data;
  }

  private handleErrorResponse(error: Error) {
    throw error;
  }

  async get(urlSuffix: string, options?: IAuthRequestOptions) {
    logger.debug('Axios - GET', { endpoint: urlSuffix });
    try {
      return this.getResponse(await this.axiosClient.get(urlSuffix, this.getHeaderConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async post(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions) {
    logger.debug('Axios - POST', { endpoint: urlSuffix, requestBody: data });
    try {
      return this.getResponse(await this.axiosClient.post(urlSuffix, data, this.getHeaderConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async put(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions) {
    logger.debug('Axios - PUT', { endpoint: urlSuffix, requestBody: data });
    try {
      return this.getResponse(await this.axiosClient.put(urlSuffix, data, this.getHeaderConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async delete(urlSuffix: string, options?: IAuthRequestOptions) {
    logger.debug('Axios - DELETE', { endpoint: urlSuffix });
    try {
      return this.getResponse(await this.axiosClient.delete(urlSuffix, this.getHeaderConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async patch(urlSuffix: string, data?: AnyObj, options?: IAuthRequestOptions) {
    logger.debug('Axios - PATCH', { endpoint: urlSuffix, requestBody: data });
    try {
      return this.getResponse(await this.axiosClient.patch(urlSuffix, data, this.getHeaderConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }
}
