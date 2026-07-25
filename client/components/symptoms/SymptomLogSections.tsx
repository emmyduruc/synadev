import type { SymptomId } from '@syna/shared-types';

import { SymptomCategoryCard } from './SymptomCategoryCard';

import { Box } from '@/components/ui/Box';
import { SYMPTOM_CATEGORIES } from '@/lib/symptoms/symptomCatalog';

export type SymptomLogSectionsProps = {
  selectedIds: ReadonlySet<SymptomId>;
  onToggle: (symptomId: SymptomId) => void;
};

export const SymptomLogSections = ({ selectedIds, onToggle }: SymptomLogSectionsProps) => (
  <Box gap="lg">
    {SYMPTOM_CATEGORIES.map((category) => (
      <SymptomCategoryCard
        key={category.id}
        category={category}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    ))}
  </Box>
);
