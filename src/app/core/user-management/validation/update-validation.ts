import { z } from 'zod';
import { passwordRegex } from '../../../shared';

export const updateUserProfileValidation = z.object({
  firstName: z.string().trim().optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  phone: z.string().optional(),
});

export type IUpdateUserProfileValidationSchema = z.infer<typeof updateUserProfileValidation>;

export const updateUserPasswordValidation = z
  .object({
    password: z.string(),
    newPassword: z
      .string()
      .trim()
      .refine(val => passwordRegex.SPECIAL_CHARACTER.test(val), { message: "Password doesn't match the requirements" }),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type IUpdateUserPasswordValidationSchema = z.infer<typeof updateUserPasswordValidation>;

export const forgotPasswordValidation = z
  .object({
    email: z.string().email().toLowerCase(),
    otp: z.string(),
    password: z
      .string()
      .trim()
      .refine(val => passwordRegex.SPECIAL_CHARACTER.test(val), { message: "Password doesn't match the requirements" }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type IForgetPasswordValidationSchema = z.infer<typeof forgotPasswordValidation>;

export const forgotPasswordOtpGenerationValidation = z.object({
  email: z.string().email().toLowerCase(),
  resend: z.boolean().default(false),
});

export type IForgetPasswordOtpGenerationValidationSchema = z.infer<typeof forgotPasswordOtpGenerationValidation>;
