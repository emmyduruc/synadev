import { useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, type FlatList as FlatListType } from 'react-native';

import { SynaChatEmptyState } from '@/components/synaChat/SynaChatEmptyState';
import { SynaChatMessageBubble } from '@/components/synaChat/SynaChatMessageBubble';
import { Box } from '@/components/ui/Box';
import type { SynaChatMessage } from '@/lib/synaChat/synaChatConstants';
import { semanticColors } from '@/lib/ui';

export type SynaChatMessageListProps = {
  messages: readonly SynaChatMessage[];
  isSending: boolean;
  onSuggestionPress: (suggestion: string) => void;
};

export const SynaChatMessageList = ({
  messages,
  isSending,
  onSuggestionPress,
}: SynaChatMessageListProps) => {
  const listRef = useRef<FlatListType<SynaChatMessage>>(null);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [messages.length, isSending]);

  if (messages.length === 0) {
    return (
      <SynaChatEmptyState
        onSuggestionPress={onSuggestionPress}
        disabled={isSending}
      />
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={[...messages]}
      keyExtractor={(item) => item.id}
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      renderItem={({ item }) => <SynaChatMessageBubble message={item} />}
      ListFooterComponent={
        isSending ? (
          <Box direction="row" justify="start" className="mb-3 px-1">
            <Box className="rounded-3xl rounded-bl-md border border-white/70 bg-card/95 px-4 py-3 shadow-sm">
              <ActivityIndicator color={semanticColors.splashBackground} size="small" />
            </Box>
          </Box>
        ) : null
      }
    />
  );
};
