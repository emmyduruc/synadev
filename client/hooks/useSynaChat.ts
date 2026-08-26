import { CHAT_REPLY_STATUS, resolveAppLocale } from '@syna/shared-types';
import { useCallback, useRef, useState } from 'react';

import { useTranslate } from '@/hooks/useTranslate';
import { postChat } from '@/lib/api';
import {
  SYNA_CHAT_MESSAGE_TONE,
  SYNA_CHAT_ROLE,
  toneFromChatStatus,
  type SynaChatMessage,
  type SynaChatMessageTone,
} from '@/lib/synaChat/synaChatConstants';

const createMessageId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const toApiMessages = (messages: SynaChatMessage[]) =>
  messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

/**
 * SYNA tab chat state. Sends conversation history to POST /chat
 * (Nest + OpenAI tools over this user's DB rows) and appends the reply.
 */
export const useSynaChat = () => {
  const { t, language } = useTranslate();
  const [messages, setMessages] = useState<SynaChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const appendMessage = useCallback(
    (
      role: SynaChatMessage['role'],
      content: string,
      tone: SynaChatMessageTone = SYNA_CHAT_MESSAGE_TONE.default,
    ) => {
      const message: SynaChatMessage = {
        id: createMessageId(),
        role,
        content,
        createdAtIso: new Date().toISOString(),
        tone,
      };

      setMessages((previous) => [...previous, message]);
      return message;
    },
    [],
  );

  const sendText = useCallback(
    async (rawText: string) => {
      const content = rawText.trim();

      if (!content || isSending) {
        return;
      }

      setDraft('');
      const userMessage = appendMessage(SYNA_CHAT_ROLE.user, content);
      setIsSending(true);

      try {
        const history = [...messagesRef.current, userMessage];
        const response = await postChat({
          messages: toApiMessages(history),
          locale: resolveAppLocale(language),
        });

        const replyContent =
          response.status === CHAT_REPLY_STATUS.invalidQuestion
            ? response.reply.trim() || t('syna_chat_invalid_question')
            : response.reply;

        appendMessage(
          SYNA_CHAT_ROLE.assistant,
          replyContent,
          toneFromChatStatus(response.status),
        );
      } catch {
        appendMessage(
          SYNA_CHAT_ROLE.assistant,
          t('syna_chat_error_reply'),
          SYNA_CHAT_MESSAGE_TONE.error,
        );
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, isSending, language, t],
  );

  const sendDraft = useCallback(async () => {
    await sendText(draft);
  }, [draft, sendText]);

  const sendSuggestion = useCallback(
    async (suggestion: string) => {
      await sendText(suggestion);
    },
    [sendText],
  );

  return {
    messages,
    draft,
    isSending,
    setDraft,
    sendDraft,
    sendSuggestion,
  };
};
