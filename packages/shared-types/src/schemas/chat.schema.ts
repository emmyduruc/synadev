import { z } from 'zod';

export const ChatMessageRoleSchema = z
  .enum(['user', 'assistant'])
  .describe('Speaker role in the SYNA chat turn');

export type ChatMessageRole = z.infer<typeof ChatMessageRoleSchema>;

export const ChatMessageSchema = z.object({
  role: ChatMessageRoleSchema,
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(4000, 'Message content is too long')
    .describe('Plain-text chat message body'),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, 'At least one message is required')
    .max(40, 'Too many messages in one request')
    .describe('Conversation history ending with the latest user message'),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  reply: z
    .string()
    .min(1)
    .describe('Assistant reply grounded in the authenticated user data tools'),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
