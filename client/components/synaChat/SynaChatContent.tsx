import { SynaChatComposer } from '@/components/synaChat/SynaChatComposer';
import { SynaChatMessageList } from '@/components/synaChat/SynaChatMessageList';
import { Box } from '@/components/ui/Box';
import type { SynaChatMessage } from '@/lib/synaChat/synaChatConstants';

export type SynaChatContentProps = {
  messages: readonly SynaChatMessage[];
  draft: string;
  isSending: boolean;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
  onSuggestionPress: (suggestion: string) => void;
};

export const SynaChatContent = ({
  messages,
  draft,
  isSending,
  onChangeDraft,
  onSend,
  onSuggestionPress,
}: SynaChatContentProps) => (
  <Box flex={1}>
    <SynaChatMessageList
      messages={messages}
      isSending={isSending}
      onSuggestionPress={onSuggestionPress}
    />
    <SynaChatComposer
      value={draft}
      onChangeText={onChangeDraft}
      onSend={onSend}
      isSending={isSending}
    />
  </Box>
);
