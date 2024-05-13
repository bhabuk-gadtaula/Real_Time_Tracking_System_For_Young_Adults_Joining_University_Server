import { z } from 'zod';

export const updateClassValidation = z.object({
  name: z.string().trim().optional(),
});

export type IUpdateClassValidationSchema = z.infer<typeof updateClassValidation>;

export const updateClassUserMap = z.object({
  userId: z.number().gt(0),
  classTriggerId: z.number().gt(0),
});

export type IUpdateClassUserMapSchema = z.infer<typeof updateClassUserMap>;

export const updateClassTriggerTime = z.object({
  classTriggerDateTime: z.date().or(z.string().pipe(z.coerce.date())),
});

export type IUpdateClassTriggerTimeSchema = z.infer<typeof updateClassTriggerTime>;
