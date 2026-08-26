export const SYNA_CHAT_ROLE = {
  user: 'user',
  assistant: 'assistant',
} as const;

export type SynaChatRole = (typeof SYNA_CHAT_ROLE)[keyof typeof SYNA_CHAT_ROLE];

export type SynaChatMessage = {
  id: string;
  role: SynaChatRole;
  content: string;
  createdAtIso: string;
};

export const SYNA_CHAT_SUGGESTION_KEYS = [
  'syna_chat_suggestion_last_period',
  'syna_chat_suggestion_symptoms',
  'syna_chat_suggestion_sleep',
] as const;
