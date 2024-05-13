import { z } from 'zod';
import { UserRole } from '../interface';
import { passwordRegex } from '../../../shared';

export const registerUserValidation = z
  .object({
    firstName: z.string().trim(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim(),
    email: z.string().email().toLowerCase(),
    phone: z.string().optional(),
    password: z
      .string()
      .trim()
      .refine(val => passwordRegex.SPECIAL_CHARACTER.test(val), { message: 'Password doesnot match the requirements' }),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  })
  .refine(data => data.role !== UserRole.CHILD, { message: 'Role cannot be CHILD' });

export type IRegisterUserValidationSchema = z.infer<typeof registerUserValidation>;

export const createUserValidation = z
  .object({
    firstName: z.string().trim(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim(),
    phone: z.string().optional(),
    email: z.string().email().toLowerCase().optional(),
    password: z
      .string()
      .trim()
      .refine(val => passwordRegex.SPECIAL_CHARACTER.test(val), { message: 'Password doesnot match the requirements' }),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type ICreateUserValidationSchema = z.infer<typeof createUserValidation>;
