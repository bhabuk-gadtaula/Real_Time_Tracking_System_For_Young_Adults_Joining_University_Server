import CustomError from './CustomError';
import httpStatus from 'http-status-codes';

/**
 * Error class for bad requests.
 */
class BadRequestError extends CustomError {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message, httpStatus.BAD_REQUEST, details);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export default BadRequestError;
