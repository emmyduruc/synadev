import { DailyLogChip } from '@/components/dailyLog/DailyLogChip';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { SymptomCategory } from '@/lib/symptoms/symptomCatalog';
import { cn } from '@/lib/ui';

export type SymptomCategoryCardProps = {
  category: SymptomCategory;
  selectedIds: ReadonlySet<string>;
  onToggle: (symptomId: string) => void;
  /** When false, only chips are rendered (title handled by accordion header). */
  showTitle?: boolean;
  className?: string;
};

/**
 * Reusable bordered category card with multi-select chips — same press/border
 * behavior as the full symptoms modal.
 */
export const SymptomCategoryCard = ({
  category,
  selectedIds,
  onToggle,
  showTitle = true,
  className,
}: SymptomCategoryCardProps) => {
  const { t } = useTranslate();

  return (
    <Box
      gap="sm"
      className={cn('rounded-3xl border p-4 shadow-sm', category.sectionClassName, className)}>
      {showTitle ? (
        <Text size="base" weight="bold">
          {t(category.titleKey)}
        </Text>
      ) : null}
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
  );
};
