import type { MoodId } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  SYMPTOM_ENTRY_MOOD_IDS,
  SYMPTOM_ENTRY_MOOD_LABEL_KEY,
  type SymptomEntryMoodId,
} from '@/lib/mood/moodLogStorage';
import { cn } from '@/lib/ui';

export type SymptomEntryMoodChipsProps = {
  selectedIds: readonly MoodId[];
  onToggle: (moodId: SymptomEntryMoodId) => void;
};

export const SymptomEntryMoodChips = ({
  selectedIds,
  onToggle,
}: SymptomEntryMoodChipsProps) => {
  const { t } = useTranslate();
  const selected = new Set(selectedIds);

  return (
    <Box gap="sm">
      <Text size="sm" weight="bold">
        {t('symptom_entry_mood_section_title')}
      </Text>
      <Box direction="row" className="flex-wrap gap-2">
        {SYMPTOM_ENTRY_MOOD_IDS.map((moodId) => {
          const isSelected = selected.has(moodId);

          return (
            <TouchableOpacity
              key={moodId}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onToggle(moodId)}
              className={cn(
                'rounded-full border px-3.5 py-2',
                isSelected
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-border bg-muted/60',
              )}>
              <Text
                size="sm"
                weight="medium"
                color={isSelected ? 'white' : 'foreground'}
                responsive={false}>
                {t(SYMPTOM_ENTRY_MOOD_LABEL_KEY[moodId])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
};
