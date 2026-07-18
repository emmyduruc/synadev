import { Box } from '@/components/ui/Box';
import { renderInsightIcon } from '@/lib/insights/insightIcons';
import type { InsightArticleImagePlaceholder } from '@/lib/insights/insightTypes';
import { cn, semanticColors } from '@/lib/ui';

export type InsightArticleImagePlaceholderProps = {
  image: InsightArticleImagePlaceholder;
};

export const InsightArticleImagePlaceholderView = ({
  image,
}: InsightArticleImagePlaceholderProps) => (
  <Box
    align="center"
    justify="center"
    className={cn('h-48 w-full rounded-2xl', image.backgroundClassName)}>
    {renderInsightIcon(image.iconKey, {
      size: 56,
      color: semanticColors.dashboardIcon.insight,
    })}
  </Box>
);
