import { MrsSeverityChips } from '@/components/mrs/MrsSeverityChips';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { MrsIiItem } from '@/lib/mrs/mrsIiCatalog';
import type { MrsIiSeverityValue } from '@/lib/mrs/mrsIiTypes';

export type MrsIiItemRowProps = {
  item: MrsIiItem;
  value: MrsIiSeverityValue | null;
  onChange: (value: MrsIiSeverityValue) => void;
};

export const MrsIiItemRow = ({ item, value, onChange }: MrsIiItemRowProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm" className="py-3">
      <Box gap="xs">
        <Text size="base" weight="semibold" className="leading-snug">
          {t(item.titleKey)}
        </Text>
        <Text size="xs" color="foreground" className="leading-relaxed italic">
          {t(item.explanationKey)}
        </Text>
      </Box>
      <MrsSeverityChips value={value} onChange={onChange} />
    </Box>
  );
};
