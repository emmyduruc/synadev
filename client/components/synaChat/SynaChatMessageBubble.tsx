import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  SYNA_CHAT_MESSAGE_TONE,
  SYNA_CHAT_ROLE,
  type SynaChatMessage,
} from '@/lib/synaChat/synaChatConstants';
import { cn } from '@/lib/ui';

export type SynaChatMessageBubbleProps = {
  message: SynaChatMessage;
};

export const SynaChatMessageBubble = ({ message }: SynaChatMessageBubbleProps) => {
  const { t } = useTranslate();
  const isUser = message.role === SYNA_CHAT_ROLE.user;
  const isInvalid = message.tone === SYNA_CHAT_MESSAGE_TONE.invalid;
  const isError = message.tone === SYNA_CHAT_MESSAGE_TONE.error;

  return (
    <Box
      direction="row"
      justify={isUser ? 'end' : 'start'}
      className="mb-3 px-1">
      <Box
        className={cn(
          'max-w-[82%] rounded-3xl px-4 py-3',
          isUser && 'rounded-br-md bg-primary-500',
          !isUser &&
            !isInvalid &&
            !isError &&
            'rounded-bl-md border border-white/70 bg-card/95 shadow-sm',
          !isUser &&
            isInvalid &&
            'rounded-bl-md border border-primary-400 bg-primary-50 shadow-sm',
          !isUser &&
            isError &&
            'rounded-bl-md border border-white/70 bg-card/95 shadow-sm',
        )}>
        {isInvalid ? (
          <Text size="2xs" weight="semibold" color="primary" className="mb-1.5">
            {t('syna_chat_invalid_question_label')}
          </Text>
        ) : null}
        <Text
          size="sm"
          className={cn(
            'leading-relaxed',
            isUser ? 'text-white' : 'text-black',
          )}>
          {message.content}
        </Text>
      </Box>
    </Box>
  );
};
