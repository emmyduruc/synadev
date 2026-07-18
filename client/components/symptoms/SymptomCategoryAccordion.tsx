import { useMemo, useState } from 'react';

import { SymptomCategoryCard } from './SymptomCategoryCard';

import { AccordionSection } from '@/components/ui/AccordionSection';
import { Box } from '@/components/ui/Box';
import { useTranslate } from '@/hooks/useTranslate';
import {
  SYMPTOM_CATEGORIES,
  SYMPTOM_CATEGORY,
  type SymptomCategoryId,
} from '@/lib/symptoms/symptomCatalog';

/** Categories surfaced in the Record Period modal (cycle-critical signals). */
export const RECORD_PERIOD_SYMPTOM_CATEGORY_IDS: readonly SymptomCategoryId[] = [
  SYMPTOM_CATEGORY.cycle,
  SYMPTOM_CATEGORY.bodyPain,
  SYMPTOM_CATEGORY.sleepEnergy,
];

export type SymptomCategoryAccordionProps = {
  selectedIds: ReadonlySet<string>;
  onToggle: (symptomId: string) => void;
  categoryIds?: readonly SymptomCategoryId[];
};

export const SymptomCategoryAccordion = ({
  selectedIds,
  onToggle,
  categoryIds = RECORD_PERIOD_SYMPTOM_CATEGORY_IDS,
}: SymptomCategoryAccordionProps) => {
  const { t } = useTranslate();
  const categories = useMemo(
    () => SYMPTOM_CATEGORIES.filter((category) => categoryIds.includes(category.id)),
    [categoryIds],
  );
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(categories[0] ? [categories[0].id] : []),
  );

  const handleToggleExpanded = (categoryId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });
  };

  return (
    <Box gap="sm">
      {categories.map((category) => (
        <AccordionSection
          key={category.id}
          title={t(category.titleKey)}
          isExpanded={expandedIds.has(category.id)}
          onToggle={() => handleToggleExpanded(category.id)}
          headerClassName={category.sectionClassName}>
          <SymptomCategoryCard
            category={category}
            selectedIds={selectedIds}
            onToggle={onToggle}
            showTitle={false}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </AccordionSection>
      ))}
    </Box>
  );
};
