import { Environment } from '../enums';
import CustomError from './CustomError';
import { ErrorResponse } from './interfaces';
import * as httpStatus from 'http-status-codes';
import { configService } from '../../../config';
import UnauthorizedError from './UnauthorizedError';

/**
 * Handle errors and build error response for the API.
 *
 * @param {any} err
 * @returns {ErrorResponse}
 */
function buildError(err: any): ErrorResponse {
  // If err is UnauthorizedError thrown by express-jwt.
  if (err.name === UnauthorizedError.name) {
    return {
      code: httpStatus.StatusCodes.UNAUTHORIZED,
      message: err.message,
    };
  }

  if (err.name === 'MongoServerError') {
    return buildMongoError(err);
  }

  // Custom Error
  if (err instanceof CustomError) {
    return {
      code: err.statusCode,
      message: err.message,
      ...filterProdConfig(err.details),
    };
  }

  return {
    code: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
    message: httpStatus.getReasonPhrase(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
    ...filterProdConfig({ message: err.message, stack: err.stack }),
  };
}

function buildMongoError(err: any) {
  const error: any = {
    code: httpStatus.StatusCodes.BAD_REQUEST,
    message: err.message,
  };

  return { ...error, ...filterProdConfig(err) };
}

function filterProdConfig(data: any) {
  return configService.getAppConfigs.env.toUpperCase() == Environment.PROD ? {} : { data };
}

export { buildError };
