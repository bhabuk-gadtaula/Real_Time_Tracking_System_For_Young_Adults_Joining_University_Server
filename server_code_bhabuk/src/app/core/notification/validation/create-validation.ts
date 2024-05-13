import { z } from 'zod';
import { ProjectModule } from '../../../shared';

export const createNotificationValidation = z.object({
  note: z.string().trim(),
  assigner: z.number(),
  moduleName: z.nativeEnum(ProjectModule),
});

export type ICreateClassValidationSchema = z.infer<typeof createNotificationValidation>;
