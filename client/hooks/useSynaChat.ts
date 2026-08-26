import { useCallback, useRef, useState } from 'react';

import { useTranslate } from '@/hooks/useTranslate';
import { postChat } from '@/lib/api';
import {
  SYNA_CHAT_ROLE,
  type SynaChatMessage,
} from '@/lib/synaChat/synaChatConstants';

const createMessageId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const toApiMessages = (messages: SynaChatMessage[]) =>
  messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

/**
 * SYNA tab chat state. Sends conversation history to POST /chat and
 * appends the grounded assistant reply (or a localized error fallback).
 */
export const useSynaChat = () => {
  const { t } = useTranslate();
  const [messages, setMessages] = useState<SynaChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const appendMessage = useCallback((role: SynaChatMessage['role'], content: string) => {
    const message: SynaChatMessage = {
      id: createMessageId(),
      role,
      content,
      createdAtIso: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, message]);
    return message;
  }, []);

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
        const response = await postChat({ messages: toApiMessages(history) });
        appendMessage(SYNA_CHAT_ROLE.assistant, response.reply);
      } catch {
        appendMessage(SYNA_CHAT_ROLE.assistant, t('syna_chat_error_reply'));
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, isSending, t],
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
