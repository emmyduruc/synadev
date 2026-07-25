import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok').describe('Health check status indicator'),
  timestamp: z.string().datetime().describe('ISO 8601 timestamp of the health check'),
  version: z.string().describe('Current API version'),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/** ISO calendar date (YYYY-MM-DD) used for date of birth. */
export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .describe('ISO calendar date in YYYY-MM-DD format');

export const UserSchema = z.object({
  id: z.string().uuid().describe('Unique Syna user identifier'),
  clerkId: z.string().min(1).describe('Clerk user id (user_…)'),
  email: z.string().email().describe('Primary email from Clerk'),
  firstName: z
    .string()
    .nullable()
    .describe('Given name collected during bio onboarding'),
  lastName: z
    .string()
    .nullable()
    .describe('Family name collected during bio onboarding'),
  dateOfBirth: IsoDateSchema.nullable().describe('Date of birth (YYYY-MM-DD)'),
  address: z
    .string()
    .nullable()
    .describe('Optional free-text address; reserved for future profile deepening'),
  isBioComplete: z
    .boolean()
    .describe('True when firstName, lastName, and dateOfBirth are all set'),
  createdAt: z.string().datetime().describe('ISO 8601 timestamp when the user was created'),
  updatedAt: z.string().datetime().describe('ISO 8601 timestamp when the user was last updated'),
});

export type User = z.infer<typeof UserSchema>;

export const UpdateUserProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name is too long')
    .describe('Given name'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long')
    .describe('Family name'),
  dateOfBirth: IsoDateSchema.describe('Date of birth (YYYY-MM-DD)'),
  address: z
    .string()
    .trim()
    .max(500, 'Address is too long')
    .optional()
    .describe('Optional free-text address'),
});

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

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
