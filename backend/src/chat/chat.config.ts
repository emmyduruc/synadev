import { z } from 'zod';

export const ChatEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required for chat'),
  OPENAI_MODEL: z
    .string()
    .min(1)
    .default('gpt-4o-mini')
    .describe('OpenAI chat model id'),
});

export type ChatEnv = z.infer<typeof ChatEnvSchema>;

export const parseChatEnv = (): ChatEnv => {
  const result = ChatEnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || undefined,
  });

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Chat configuration invalid: ${messages}`);
  }

  return result.data;
};
