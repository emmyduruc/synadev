import { z } from 'zod';

import { AppLocaleSchema } from './locale.schema';

export const CHAT_MESSAGE_ROLE = {
  user: 'user',
  assistant: 'assistant',
} as const;

export const ChatMessageRoleSchema = z
  .enum([CHAT_MESSAGE_ROLE.user, CHAT_MESSAGE_ROLE.assistant])
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
  locale: AppLocaleSchema.optional().describe(
    'Preferred UI locale from the client (de | en). Used when the question language is unclear.',
  ),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/** Structured chat outcome for client UI (ok vs off-topic vs empty data). */
export const CHAT_REPLY_STATUS = {
  ok: 'ok',
  invalidQuestion: 'invalid_question',
  noData: 'no_data',
} as const;

export const CHAT_REPLY_STATUSES = [
  CHAT_REPLY_STATUS.ok,
  CHAT_REPLY_STATUS.invalidQuestion,
  CHAT_REPLY_STATUS.noData,
] as const;

export const ChatReplyStatusSchema = z
  .enum(CHAT_REPLY_STATUSES)
  .describe(
    'ok = grounded answer; invalid_question = off-topic / not about this SYNA account; no_data = on-topic but no matching rows',
  );

export type ChatReplyStatus = z.infer<typeof ChatReplyStatusSchema>;

export const ChatResponseSchema = z.object({
  status: ChatReplyStatusSchema,
  reply: z
    .string()
    .min(1)
    .describe('Assistant reply text in the user language (or preferred locale)'),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/** Zod schema used by the model structured output (same shape as ChatResponse). */
export const ChatModelOutputSchema = ChatResponseSchema;
