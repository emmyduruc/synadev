import type { SymptomCategoryId, SymptomDayEntry, SymptomId } from '@syna/shared-types';

import { SymptomEntryRow } from '@/components/symptoms/entry/SymptomEntryRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { SYMPTOM_CATEGORIES } from '@/lib/symptoms/symptomCatalog';
import { findDayEntry } from '@/lib/symptoms/symptomEntryHelpers';

export type SymptomEntryCategoryListProps = {
  categoryId: SymptomCategoryId;
  dayEntries: readonly SymptomDayEntry[] | undefined;
  favoriteIds: readonly SymptomId[];
  onPressSymptom: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
};

export const SymptomEntryCategoryList = ({
  categoryId,
  dayEntries,
  favoriteIds,
  onPressSymptom,
  onToggleFavorite,
}: SymptomEntryCategoryListProps) => {
  const { t } = useTranslate();
  const category = SYMPTOM_CATEGORIES.find((item) => item.id === categoryId);
  const favoriteSet = new Set(favoriteIds);

  if (!category) {
    return null;
  }

  return (
    <Box gap="sm">
      <Text size="sm" weight="semibold">
        {t(category.titleKey)}
      </Text>
      {category.options.map((option) => {
        const entry = findDayEntry(dayEntries, option.id);

        return (
          <SymptomEntryRow
            key={option.id}
            symptomId={option.id}
            intensity={entry?.intensity}
            isSelected={Boolean(entry)}
            isFavorite={favoriteSet.has(option.id)}
            onPress={() => onPressSymptom(option.id)}
            onToggleFavorite={() => onToggleFavorite(option.id)}
          />
        );
      })}
    </Box>
  );
};
