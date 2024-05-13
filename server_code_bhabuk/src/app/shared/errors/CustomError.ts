/**
 * Generic class for error that will be extended by other errors.
 */
class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
