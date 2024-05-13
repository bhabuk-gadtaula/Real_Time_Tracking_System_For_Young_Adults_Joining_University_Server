import * as httpStatus from 'http-status-codes';
import { CustomError, buildError, logger, NextFunction, Request, Response } from '../shared';

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function genericErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.stack) {
    logger.error('Error stack trace: ', err.stack);
  }

  const error = buildError(err);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json(error);
  } else if (typeof error.code === 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json(error);
  } else {
    res.status(error.code).json(error);
  }
}
