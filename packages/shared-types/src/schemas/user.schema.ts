import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok').describe('Health check status indicator'),
  timestamp: z.string().datetime().describe('ISO 8601 timestamp of the health check'),
  version: z.string().describe('Current API version'),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const CreateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .describe('User email address used for authentication and notifications'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .describe('Display name of the user'),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UserSchema = z.object({
  id: z.string().uuid().describe('Unique user identifier'),
  email: z.string().email().describe('User email address'),
  name: z.string().describe('Display name of the user'),
  createdAt: z.string().datetime().describe('ISO 8601 timestamp when the user was created'),
});

export type User = z.infer<typeof UserSchema>;

export const ApiValidationIssueSchema = z.object({
  code: z.string().describe('Zod validation error code'),
  path: z
    .array(z.union([z.string(), z.number()]))
    .describe('Path to the invalid field in the request body'),
  message: z.string().describe('Human-readable validation error message'),
});

export type ApiValidationIssue = z.infer<typeof ApiValidationIssueSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number().describe('HTTP status code'),
  message: z
    .union([z.string(), z.array(z.string())])
    .describe('Error message or list of error messages'),
  error: z.string().optional().describe('Short error label (e.g. Bad Request)'),
  errors: z
    .array(ApiValidationIssueSchema)
    .optional()
    .describe('Detailed Zod validation issues when request body fails validation'),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
