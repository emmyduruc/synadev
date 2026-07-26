import { useMemo, useState } from 'react';

import { MrsIiItemRow } from '@/components/mrs/MrsIiItemRow';
import { AccordionSection } from '@/components/ui/AccordionSection';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { MRS_II_ITEMS, MRS_II_SUBSCALES } from '@/lib/mrs/mrsIiCatalog';
import type {
  MrsIiAnswersByItem,
  MrsIiItemId,
  MrsIiSeverityValue,
  MrsIiSubscaleId,
} from '@/lib/mrs/mrsIiTypes';

export type MrsIiSubscaleAccordionProps = {
  answers: MrsIiAnswersByItem;
  onChangeItem: (itemId: MrsIiItemId, value: MrsIiSeverityValue) => void;
};

export const MrsIiSubscaleAccordion = ({
  answers,
  onChangeItem,
}: MrsIiSubscaleAccordionProps) => {
  const { t } = useTranslate();
  /** Exclusive accordion: only one subscale open at a time. */
  const [expandedId, setExpandedId] = useState<MrsIiSubscaleId | null>(
    MRS_II_SUBSCALES[0]?.id ?? null,
  );

  const itemsById = useMemo(
    () => Object.fromEntries(MRS_II_ITEMS.map((item) => [item.id, item])),
    [],
  );

  const handleToggleExpanded = (subscaleId: MrsIiSubscaleId) => {
    setExpandedId((previous) => (previous === subscaleId ? null : subscaleId));
  };

  return (
    <Box gap="sm">
      {MRS_II_SUBSCALES.map((subscale) => (
        <AccordionSection
          key={subscale.id}
          title={t(subscale.titleKey)}
          isExpanded={expandedId === subscale.id}
          onToggle={() => handleToggleExpanded(subscale.id)}
          headerClassName={subscale.sectionClassName}>
          <Text size="xs" color="foreground" className="mb-2 leading-relaxed">
            {t(subscale.subtitleKey)}
          </Text>
          <Box gap="md">
            {subscale.itemIds.map((itemId) => {
              const item = itemsById[itemId];

              if (!item) {
                return null;
              }

              return (
                <MrsIiItemRow
                  key={item.id}
                  item={item}
                  value={answers[item.id]}
                  onChange={(value) => onChangeItem(item.id, value)}
                />
              );
            })}
          </Box>
        </AccordionSection>
      ))}
    </Box>
  );
};
