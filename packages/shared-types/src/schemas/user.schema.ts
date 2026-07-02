import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const ApiValidationIssueSchema = z.object({
  code: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
});

export type ApiValidationIssue = z.infer<typeof ApiValidationIssueSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  errors: z.array(ApiValidationIssueSchema).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
