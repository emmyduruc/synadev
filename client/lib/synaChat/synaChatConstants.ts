import type { ChatReplyStatus } from '@syna/shared-types';
import { CHAT_REPLY_STATUS } from '@syna/shared-types';

export const SYNA_CHAT_ROLE = {
  user: 'user',
  assistant: 'assistant',
} as const;

export type SynaChatRole = (typeof SYNA_CHAT_ROLE)[keyof typeof SYNA_CHAT_ROLE];

export const SYNA_CHAT_MESSAGE_TONE = {
  default: 'default',
  invalid: 'invalid',
  error: 'error',
} as const;

export type SynaChatMessageTone =
  (typeof SYNA_CHAT_MESSAGE_TONE)[keyof typeof SYNA_CHAT_MESSAGE_TONE];

export type SynaChatMessage = {
  id: string;
  role: SynaChatRole;
  content: string;
  createdAtIso: string;
  tone?: SynaChatMessageTone;
};

export const SYNA_CHAT_SUGGESTION_KEYS = [
  'syna_chat_suggestion_last_period',
  'syna_chat_suggestion_symptoms',
  'syna_chat_suggestion_sleep',
] as const;

export const toneFromChatStatus = (
  status: ChatReplyStatus,
): SynaChatMessageTone => {
  if (status === CHAT_REPLY_STATUS.invalidQuestion) {
    return SYNA_CHAT_MESSAGE_TONE.invalid;
  }

  return SYNA_CHAT_MESSAGE_TONE.default;
};
