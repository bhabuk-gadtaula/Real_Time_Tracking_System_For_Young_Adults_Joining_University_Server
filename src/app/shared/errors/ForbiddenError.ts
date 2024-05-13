import CustomError from './CustomError';
import HttpStatus from 'http-status-codes';

/**
 * Error class for forbidden error.
 */
class ForbiddenError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.FORBIDDEN, details);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export default ForbiddenError;
