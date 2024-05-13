import { z } from 'zod';
import { ProjectModule } from '../../../shared';

export const createLocationValidation = z.object({
  source: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .required(),
  referenceId: z.number(),
  moduleName: z.nativeEnum(ProjectModule),
});

export type ICreateLocationValidationSchema = z.infer<typeof createLocationValidation>;

export const createLocationUserValidation = z.object({
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

export type ICreateLocationUserValidationSchema = z.infer<typeof createLocationUserValidation>;

export const distanceCalculationValidation = z.object({
  userGeoLocation: z.object({
    lat: z.number(),
    long: z.number(),
  }),
  classId: z.number(),
});

export type IDistanceCalculationValidationSchema = z.infer<typeof distanceCalculationValidation>;
