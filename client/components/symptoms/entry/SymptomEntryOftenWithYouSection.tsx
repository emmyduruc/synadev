import type { SymptomDayEntry, SymptomId } from '@syna/shared-types';
import { useState } from 'react';

import { SymptomEntryRow } from '@/components/symptoms/entry/SymptomEntryRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { findDayEntry } from '@/lib/symptoms/symptomEntryHelpers';

export type SymptomEntryOftenWithYouSectionProps = {
  symptomIds: readonly SymptomId[];
  dayEntries: readonly SymptomDayEntry[] | undefined;
  favoriteIds: readonly SymptomId[];
  onPressSymptom: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
};

export const SymptomEntryOftenWithYouSection = ({
  symptomIds,
  dayEntries,
  favoriteIds,
  onPressSymptom,
  onToggleFavorite,
}: SymptomEntryOftenWithYouSectionProps) => {
  const { t } = useTranslate();
  const [isExpanded, setIsExpanded] = useState(true);

  if (symptomIds.length === 0) {
    return null;
  }

  const favoriteSet = new Set(favoriteIds);

  return (
    <Box className="rounded-2xl border border-border bg-card px-3 py-3" gap="sm">
      <Box direction="row" align="start" justify="between" gap="sm">
        <Box flex={1} gap="xs">
          <Text size="sm" weight="semibold">
            {t('symptom_entry_often_heading')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('symptom_entry_often_subtitle')}
          </Text>
        </Box>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setIsExpanded((previous) => !previous)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Text size="sm" weight="bold" color="foreground-muted">
            {isExpanded ? t('symptom_entry_hide') : t('symptom_entry_show')}
          </Text>
        </TouchableOpacity>
      </Box>

      {isExpanded
        ? symptomIds.map((symptomId) => {
            const entry = findDayEntry(dayEntries, symptomId);

            return (
              <SymptomEntryRow
                key={symptomId}
                symptomId={symptomId}
                intensity={entry?.intensity}
                isSelected={Boolean(entry)}
                isFavorite={favoriteSet.has(symptomId)}
                onPress={() => onPressSymptom(symptomId)}
                onToggleFavorite={() => onToggleFavorite(symptomId)}
              />
            );
          })
        : null}
    </Box>
  );
};
