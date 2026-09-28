import type { SymptomDayEntry, SymptomId } from '@syna/shared-types';

import { SymptomEntryRow } from '@/components/symptoms/entry/SymptomEntryRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { findDayEntry } from '@/lib/symptoms/symptomEntryHelpers';

export type SymptomEntryFavoritesSectionProps = {
  favoriteIds: readonly SymptomId[];
  dayEntries: readonly SymptomDayEntry[] | undefined;
  onPressSymptom: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
  onSelectFavorites?: () => void;
};

export const SymptomEntryFavoritesSection = ({
  favoriteIds,
  dayEntries,
  onPressSymptom,
  onToggleFavorite,
  onSelectFavorites,
}: SymptomEntryFavoritesSectionProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Box gap="xs">
        <Text size="sm" weight="semibold">
          {t('symptom_entry_favorites_heading')}
        </Text>
        <Text size="xs" color="foreground-muted" className="leading-relaxed">
          {t('symptom_entry_favorites_hint')}
        </Text>
      </Box>

      {favoriteIds.length === 0 ? (
        <Box
          align="center"
          className="rounded-2xl border border-border bg-card px-4 py-6"
          gap="sm">
          <Text size="sm" color="foreground-muted" className="text-center">
            {t('symptom_entry_favorites_empty_title')}
          </Text>
          {onSelectFavorites ? (
            <TouchableOpacity accessibilityRole="button" onPress={onSelectFavorites}>
              <Text size="sm" weight="bold" color="primary">
                {t('symptom_entry_favorites_select_cta')}
              </Text>
            </TouchableOpacity>
          ) : null}
        </Box>
      ) : (
        <Box gap="sm">
          {favoriteIds.map((symptomId) => {
            const entry = findDayEntry(dayEntries, symptomId);

            return (
              <SymptomEntryRow
                key={symptomId}
                symptomId={symptomId}
                intensity={entry?.intensity}
                isSelected={Boolean(entry)}
                isFavorite
                onPress={() => onPressSymptom(symptomId)}
                onToggleFavorite={() => onToggleFavorite(symptomId)}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
