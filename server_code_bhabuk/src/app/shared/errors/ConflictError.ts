import CustomError from './CustomError';
import httpStatus from 'http-status-codes';

/**
 * Error class for conflict error.
 */
class ConflictError extends CustomError {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message, httpStatus.CONFLICT, details);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export default ConflictError;
