import CustomError from './CustomError';
import * as httpStatus from 'http-status-codes';

/**
 * Error class for not found error.
 */
class NotFoundError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, httpStatus.StatusCodes.NOT_FOUND, details);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
