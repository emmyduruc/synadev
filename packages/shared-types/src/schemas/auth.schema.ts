import { z } from 'zod';

const emailField = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const passwordField = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

const verificationCodeField = z
  .string()
  .min(1, 'Verification code is required');

export const loginFormSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  email: emailField,
  password: passwordField,
  code: z.string(),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerCredentialsSchema = registerFormSchema.pick({
  email: true,
  password: true,
});

export type RegisterCredentialsValues = z.infer<typeof registerCredentialsSchema>;

export const registerVerificationSchema = registerFormSchema.pick({
  code: true,
});

export type RegisterVerificationValues = z.infer<typeof registerVerificationSchema>;

export const forgotPasswordFormSchema = z.object({
  email: emailField,
  code: verificationCodeField,
  password: passwordField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const forgotPasswordEmailSchema = forgotPasswordFormSchema.pick({
  email: true,
});

export type ForgotPasswordEmailValues = z.infer<typeof forgotPasswordEmailSchema>;

export const forgotPasswordResetSchema = forgotPasswordFormSchema.pick({
  code: true,
  password: true,
});

export type ForgotPasswordResetValues = z.infer<typeof forgotPasswordResetSchema>;
