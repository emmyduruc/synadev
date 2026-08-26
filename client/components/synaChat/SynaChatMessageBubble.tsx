import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { SYNA_CHAT_ROLE, type SynaChatMessage } from '@/lib/synaChat/synaChatConstants';
import { cn } from '@/lib/ui';

export type SynaChatMessageBubbleProps = {
  message: SynaChatMessage;
};

export const SynaChatMessageBubble = ({ message }: SynaChatMessageBubbleProps) => {
  const isUser = message.role === SYNA_CHAT_ROLE.user;

  return (
    <Box
      direction="row"
      justify={isUser ? 'end' : 'start'}
      className="mb-3 px-1">
      <Box
        className={cn(
          'max-w-[82%] rounded-3xl px-4 py-3',
          isUser
            ? 'rounded-br-md bg-primary-500'
            : 'rounded-bl-md border border-white/70 bg-card/95 shadow-sm',
        )}>
        <Text
          size="sm"
          className={cn('leading-relaxed', isUser ? 'text-white' : 'text-black')}>
          {message.content}
        </Text>
      </Box>
    </Box>
  );
};
