import CustomError from './CustomError';
import * as httpStatus from 'http-status-codes';

/**
 * Error class for unauthorized error.
 */
class UnauthorizedError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, httpStatus.StatusCodes.UNAUTHORIZED, details);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export default UnauthorizedError;
