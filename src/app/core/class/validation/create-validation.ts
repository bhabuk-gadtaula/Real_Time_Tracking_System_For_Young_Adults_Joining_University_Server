import { z } from 'zod';

export const createClassValidation = z.object({
  name: z.string().trim(),
});

export type ICreateClassValidationSchema = z.infer<typeof createClassValidation>;

export const createClassUserMap = z.object({
  classId: z.number().gt(0),
  userId: z.number().gt(0),
  classTriggerId: z.number().gt(0),
});

export type ICreateClassUserMapSchema = z.infer<typeof createClassUserMap>;

export const createClassTriggerTime = z.object({
  classId: z.number().gt(0),
  classTriggerDateTime: z.date().or(z.string().pipe(z.coerce.date())),
});

export type ICreateClassTriggerTimeSchema = z.infer<typeof createClassTriggerTime>;
