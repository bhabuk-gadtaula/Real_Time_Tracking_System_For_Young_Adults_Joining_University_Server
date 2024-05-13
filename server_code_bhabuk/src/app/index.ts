import express from 'express';
import { appRouter } from './http/routes';
import { requestInterceptor, genericErrorHandler } from './middlewares';

export async function initialize(app: express.Application) {
  app.use('/api', requestInterceptor, appRouter);
  app.use(genericErrorHandler);
}
