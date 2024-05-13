import { z } from 'zod';

export const createChatValidation = z.object({
  message: z.string().trim(),
  sender: z.string().trim().toLowerCase(),
  receiver: z.string().trim().toLowerCase(),
});

export type ICreateChatValidationSchema = z.infer<typeof createChatValidation>;
