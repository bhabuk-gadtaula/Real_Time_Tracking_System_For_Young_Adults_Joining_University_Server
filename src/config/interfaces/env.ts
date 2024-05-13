import { ZodType, z } from 'zod';

export type EnvConfiguration<T extends ZodType<any, any, any> = any> = z.infer<T> & {
  [key: string]: any;
};
