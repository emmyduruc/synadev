import type {
  CustomSymptom,
  SymptomCategoryId,
  SymptomDayEntry,
  SymptomId,
} from '@syna/shared-types';

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
  customSymptoms?: readonly CustomSymptom[];
  onPressSymptom: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
};

export const SymptomEntryCategoryList = ({
  categoryId,
  dayEntries,
  favoriteIds,
  customSymptoms = [],
  onPressSymptom,
  onToggleFavorite,
}: SymptomEntryCategoryListProps) => {
  const { t } = useTranslate();
  const category = SYMPTOM_CATEGORIES.find((item) => item.id === categoryId);
  const favoriteSet = new Set(favoriteIds);
  const categoryCustoms = customSymptoms.filter(
    (symptom) => symptom.categoryId === categoryId,
  );

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
      {categoryCustoms.map((symptom) => {
        const entry = findDayEntry(dayEntries, symptom.id);

        return (
          <SymptomEntryRow
            key={symptom.id}
            symptomId={symptom.id}
            intensity={entry?.intensity}
            isSelected={Boolean(entry)}
            isFavorite={favoriteSet.has(symptom.id)}
            customLabel={symptom.label}
            onPress={() => onPressSymptom(symptom.id)}
            onToggleFavorite={() => onToggleFavorite(symptom.id)}
          />
        );
      })}
    </Box>
  );
};
