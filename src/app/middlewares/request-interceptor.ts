import { isEmpty, logger } from '../shared';
import { NextFunction, Request, Response } from 'express';

async function requestInterceptor(request: Request, _: Response, next: NextFunction) {
  const { body, query, method, params, originalUrl } = request;
  const host = request.get('host');

  logger.debug(`Request received on ${method}:${originalUrl} from ${host}`, {
    ...(!isEmpty(query) && { query }),
    ...(Object.keys(params).length && { params }),
  });
  if (!isEmpty(body)) logger.debug('Request Body:', { body });
  next();
}

export default requestInterceptor;
