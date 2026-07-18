import { Box } from '@/components/ui/Box';
import { BookIcon } from '@/components/ui/icons/BookIcon';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { renderInsightIcon } from '@/lib/insights/insightIcons';
import type { InsightStorySlide } from '@/lib/insights/insightTypes';
import { semanticColors } from '@/lib/ui';

export type InsightStorySlideContentProps = {
  slide: InsightStorySlide;
};

export const InsightStorySlideContent = ({ slide }: InsightStorySlideContentProps) => {
  const { t } = useTranslate();

  return (
    <Box flex={1} justify="center" gap="md" className="px-2">
      <Box align="center" className="mb-2">
        {renderInsightIcon(slide.iconKey, {
          size: 40,
          color: semanticColors.dashboardIcon.insight,
        })}
      </Box>

      {slide.subtitleKey ? (
        <Text size="xs" color="foreground-muted" align="center" className="leading-relaxed">
          {t(slide.subtitleKey)}
        </Text>
      ) : null}

      <Text size="3xl" weight="bold" align="center" className="leading-tight">
        {t(slide.headlineKey)}
      </Text>

      <Text size="sm" align="center" className="leading-relaxed text-black">
        {t(slide.bodyKey)}
      </Text>

      {slide.badgeLabelKey ? (
        <Box align="center" className="mt-2">
          <Tag
            label={t(slide.badgeLabelKey)}
            icon={<BookIcon size={14} color={semanticColors.foregroundMuted} />}
            iconPosition="left"
            className="border-border bg-card/90"
          />
        </Box>
      ) : null}
    </Box>
  );
};
