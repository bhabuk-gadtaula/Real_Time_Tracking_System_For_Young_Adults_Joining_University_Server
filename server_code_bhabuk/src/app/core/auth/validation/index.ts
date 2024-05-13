import { z } from 'zod';

export const loginValidation = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string(),
});

export type ILoginValidation = z.infer<typeof loginValidation>;
