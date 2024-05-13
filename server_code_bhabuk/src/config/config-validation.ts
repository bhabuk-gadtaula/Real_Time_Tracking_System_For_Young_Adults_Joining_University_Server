import { AnyZodObject } from 'zod';

const validateConfig = <T>(config: any, schema: AnyZodObject, schemaName?: string) => {
  const result = schema.safeParse(config);

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.log(`Environment Variable Validation failed, ${schemaName}:`, (<any>result).error.format());
    process.exit(1);
  }

  return result.data as T;
};

export { validateConfig };
