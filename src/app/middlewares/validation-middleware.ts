import { AnyZodObject } from 'zod';

const validate = (schema: AnyZodObject) => {
  return async (req: any, res: any, next: any) => {
    const payloadType = ['POST', 'PUT', 'PATCH'].includes(req.method) ? 'body' : 'query';
    try {
      const parsed = await schema.parseAsync(req[payloadType]);
      req[payloadType] = parsed;
      next();
    } catch (error: any) {
      return res.status(400).json(error.format());
    }
  };
};

export default validate;
