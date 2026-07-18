import { ScrollView } from 'react-native';

import { DashboardInsightCard } from './DashboardInsightCard';

import { InsightArticleModal } from '@/components/insights/InsightArticleModal';
import { InsightStoryModal } from '@/components/insights/InsightStoryModal';
import { Box } from '@/components/ui/Box';
import { FlameIcon } from '@/components/ui/icons/FlameIcon';
import { InsightPatternIcon } from '@/components/ui/icons/InsightPatternIcon';
import { SleepIcon } from '@/components/ui/icons/SleepIcon';
import { Text } from '@/components/ui/Text';
import { useInsightStoryFlow } from '@/hooks/useInsightStoryFlow';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_INSIGHT_SURFACE } from '@/lib/dashboard/surfaces';
import { INSIGHT_ICON_KEY } from '@/lib/insights/constants';
import { INSIGHT_CONTENT_MOCK } from '@/lib/insights/insightContentMock';
import { semanticColors } from '@/lib/ui';

const CARD_ICONS = {
  [INSIGHT_ICON_KEY.pattern]: (
    <InsightPatternIcon size={20} color={semanticColors.dashboardIcon.insight} />
  ),
  [INSIGHT_ICON_KEY.sleep]: <SleepIcon size={20} color={semanticColors.dashboardIcon.sleep} />,
  [INSIGHT_ICON_KEY.flame]: <FlameIcon size={20} color={semanticColors.dashboardIcon.insight} />,
} as const;

const CARD_SURFACES = {
  mrs: DASHBOARD_INSIGHT_SURFACE.mrs,
  sleep: DASHBOARD_INSIGHT_SURFACE.sleep,
  heat: DASHBOARD_INSIGHT_SURFACE.heat,
} as const;

const CARD_ICON_BY_INSIGHT = {
  mrs: INSIGHT_ICON_KEY.pattern,
  sleep: INSIGHT_ICON_KEY.sleep,
  heat: INSIGHT_ICON_KEY.flame,
} as const;

export const DashboardInsightsSection = () => {
  const { t } = useTranslate();
  const {
    activeInsight,
    activeSlideIndex,
    openInsight,
    closeInsight,
    goToNextSlide,
    goToPreviousSlide,
    openArticle,
    closeArticle,
    isStoryVisible,
    isArticleVisible,
  } = useInsightStoryFlow();

  return (
    <Box gap="sm">
      <Box gap="xs">
        <Text size="lg" weight="bold">
          {t('dashboard_insights_title')}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('dashboard_insights_subtitle')}
        </Text>
      </Box>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box direction="row" className="pr-2">
          {INSIGHT_CONTENT_MOCK.map((insight) => (
            <DashboardInsightCard
              key={insight.id}
              eyebrow={t(insight.eyebrowKey)}
              title={t(insight.cardTitleKey)}
              description={t(insight.cardDescriptionKey)}
              icon={CARD_ICONS[CARD_ICON_BY_INSIGHT[insight.id]]}
              backgroundClassName={CARD_SURFACES[insight.surfaceKey]}
              onPress={() => openInsight(insight.id)}
            />
          ))}
        </Box>
      </ScrollView>

      {activeInsight ? (
        <>
          <InsightStoryModal
            insight={activeInsight}
            activeSlideIndex={activeSlideIndex}
            visible={isStoryVisible}
            onClose={closeInsight}
            onNext={goToNextSlide}
            onPrevious={goToPreviousSlide}
            onReadNow={openArticle}
          />
          <InsightArticleModal
            insight={activeInsight}
            visible={isArticleVisible}
            onClose={closeArticle}
          />
        </>
      ) : null}
    </Box>
  );
};
