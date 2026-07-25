import { z } from 'zod';

export const ClerkEnvSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
});

export type ClerkEnv = z.infer<typeof ClerkEnvSchema>;

export const parseClerkEnv = (): ClerkEnv => {
  const result = ClerkEnvSchema.safeParse({
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  });

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Clerk configuration invalid: ${messages}`);
  }

  return result.data;
};
