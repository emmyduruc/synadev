import { DailyLogChip } from '@/components/dailyLog/DailyLogChip';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { SYMPTOM_CATEGORIES } from '@/lib/symptoms/symptomCatalog';
import { cn } from '@/lib/ui';

export type SymptomLogSectionsProps = {
  selectedIds: ReadonlySet<string>;
  onToggle: (symptomId: string) => void;
};

export const SymptomLogSections = ({ selectedIds, onToggle }: SymptomLogSectionsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="lg">
      {SYMPTOM_CATEGORIES.map((category) => (
        <Box
          key={category.id}
          gap="sm"
          className={cn('rounded-3xl border p-4 shadow-sm', category.sectionClassName)}>
          <Text size="base" weight="bold">
            {t(category.titleKey)}
          </Text>
          <Box direction="row" className="flex-wrap gap-2">
            {category.options.map((option) => (
              <DailyLogChip
                key={option.id}
                label={t(option.labelKey)}
                emoji={option.emoji}
                wellClassName={category.wellClassName}
                isSelected={selectedIds.has(option.id)}
                onPress={() => onToggle(option.id)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
