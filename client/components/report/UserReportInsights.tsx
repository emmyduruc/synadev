import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { UserReportInsightBlock } from '@/lib/report/userReportTypes';

export type UserReportInsightsProps = {
  blocks: readonly UserReportInsightBlock[];
};

export const UserReportInsights = ({ blocks }: UserReportInsightsProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="xl">
      {blocks.map((block) => (
        <Box
          key={block.id}
          gap="sm"
          className="border-l-4 border-primary pl-4">
          <Text size="base" weight="bold" className="text-black">
            {t(block.titleKey)}
          </Text>
          <Text size="sm" className="leading-relaxed text-black">
            {t(block.bodyKey, block.params)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
