import { z } from 'zod';
import { ProjectModule } from '../../../shared';

export const updateMyLocationValidation = z.object({
  source: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .required(),

  destination: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  referenceId: z.number(),
});

export type IUpdateMyLocationValidationSchema = z.infer<typeof updateMyLocationValidation>;

export const updateLocationValidation = z.object({
  source: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .required(),

  destination: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  referenceId: z.number(),
  moduleName: z.nativeEnum(ProjectModule),
});

export type IUpdateLocationValidationSchema = z.infer<typeof updateLocationValidation>;
