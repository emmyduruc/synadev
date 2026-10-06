import { ScrollView } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  SYMPTOM_ENTRY_FILTER_LABEL_KEY,
  SYMPTOM_ENTRY_FILTER_ORDER,
  type SymptomEntryFilterId,
} from '@/lib/symptoms/symptomEntryConstants';
import { cn } from '@/lib/ui';

export type SymptomEntryFilterChipsProps = {
  activeFilter: SymptomEntryFilterId;
  onChangeFilter: (filter: SymptomEntryFilterId) => void;
};

export const SymptomEntryFilterChips = ({
  activeFilter,
  onChangeFilter,
}: SymptomEntryFilterChipsProps) => {
  const { t } = useTranslate();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Box direction="row" gap="sm" className="pr-2">
        {SYMPTOM_ENTRY_FILTER_ORDER.map((filterId) => {
          const isActive = filterId === activeFilter;

          return (
            <TouchableOpacity
              key={filterId}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChangeFilter(filterId)}
              className={cn(
                'rounded-full border px-4 py-3',
                isActive
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-border bg-card',
              )}>
              <Text
                size="sm"
                weight="medium"
                color={isActive ? 'white' : 'foreground'}
                responsive={false}>
                {t(SYMPTOM_ENTRY_FILTER_LABEL_KEY[filterId])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </ScrollView>
  );
};
