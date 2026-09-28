import type { SymptomDayEntry, SymptomId } from '@syna/shared-types';
import { useState } from 'react';

import { SymptomEntryRow } from '@/components/symptoms/entry/SymptomEntryRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  PERSISTENT_COMPLAINT_CHIP_LABEL_KEY,
  PERSISTENT_COMPLAINT_PRESET_IDS,
} from '@/lib/symptoms/symptomEntryConstants';
import { findDayEntry } from '@/lib/symptoms/symptomEntryHelpers';
import { cn } from '@/lib/ui';

export type SymptomEntryPersistentSectionProps = {
  dayEntries: readonly SymptomDayEntry[] | undefined;
  favoriteIds: readonly SymptomId[];
  onPressSymptom: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
  onTogglePreset: (symptomId: SymptomId, shouldSelect: boolean) => void;
};

export const SymptomEntryPersistentSection = ({
  dayEntries,
  favoriteIds,
  onPressSymptom,
  onToggleFavorite,
  onTogglePreset,
}: SymptomEntryPersistentSectionProps) => {
  const { t } = useTranslate();
  const [isExpanded, setIsExpanded] = useState(false);
  const favoriteSet = new Set(favoriteIds);

  const selectedPresetIds = PERSISTENT_COMPLAINT_PRESET_IDS.filter((symptomId) =>
    Boolean(findDayEntry(dayEntries, symptomId)),
  );

  return (
    <Box className="rounded-2xl border border-border bg-card px-3 py-3" gap="sm">
      <Box direction="row" align="center" justify="between">
        <Text size="sm" weight="semibold">
          {t('symptom_entry_persistent_heading')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setIsExpanded((previous) => !previous)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Text size="sm" weight="bold" color="foreground-muted">
            {isExpanded ? t('symptom_entry_hide') : t('symptom_entry_show')}
          </Text>
        </TouchableOpacity>
      </Box>

      {isExpanded ? (
        <Box gap="sm">
          {selectedPresetIds.map((symptomId) => {
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
          })}

          <Text size="xs" color="foreground-muted">
            {t('symptom_entry_persistent_tap_hint')}
          </Text>

          <Box direction="row" className="flex-wrap" gap="sm">
            {PERSISTENT_COMPLAINT_PRESET_IDS.map((symptomId) => {
              const isSelected = Boolean(findDayEntry(dayEntries, symptomId));

              return (
                <TouchableOpacity
                  key={symptomId}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onTogglePreset(symptomId, !isSelected)}
                  className={cn(
                    'rounded-full px-3.5 py-2',
                    isSelected ? 'bg-primary-500' : 'bg-lavender-light',
                  )}>
                  <Text
                    size="xs"
                    weight="medium"
                    color={isSelected ? 'white' : 'foreground'}
                    responsive={false}>
                    {t(PERSISTENT_COMPLAINT_CHIP_LABEL_KEY[symptomId])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
