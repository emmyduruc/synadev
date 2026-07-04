import { z } from 'zod';

export const EmailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email'),
  RESEND_FROM_NAME: z.string().min(1).default('SYNA'),
});

export type EmailEnv = z.infer<typeof EmailEnvSchema>;

export const parseEmailEnv = (): EmailEnv => {
  const result = EmailEnvSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME ?? 'SYNA',
  });

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Email configuration invalid: ${messages}`);
  }

  return result.data;
};

export const formatSenderAddress = (email: string, name: string): string =>
  `${name} <${email}>`;
