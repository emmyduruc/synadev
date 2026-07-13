import { ScrollView } from 'react-native';

import { DashboardInsightCard } from './DashboardInsightCard';

import { Box } from '@/components/ui/Box';
import { FlameIcon } from '@/components/ui/icons/FlameIcon';
import { InsightPatternIcon } from '@/components/ui/icons/InsightPatternIcon';
import { SleepIcon } from '@/components/ui/icons/SleepIcon';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_INSIGHT_SURFACE } from '@/lib/dashboard/surfaces';
import { semanticColors } from '@/lib/ui';

export const DashboardInsightsSection = () => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Box gap="xs">
        <Text size="2xl" weight="bold">
          {t('dashboard_insights_title')}
        </Text>
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('dashboard_insights_subtitle')}
        </Text>
      </Box>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box direction="row" className="pr-2">
          <DashboardInsightCard
            eyebrow={t('dashboard_insight_mrs_eyebrow')}
            title={t('dashboard_insight_mrs_title')}
            description={t('dashboard_insight_mrs_description')}
            icon={<InsightPatternIcon size={28} color={semanticColors.dashboardIcon.insight} />}
            backgroundClassName={DASHBOARD_INSIGHT_SURFACE.mrs}
          />
          <DashboardInsightCard
            eyebrow={t('dashboard_insight_sleep_eyebrow')}
            title={t('dashboard_insight_sleep_title')}
            description={t('dashboard_insight_sleep_description')}
            icon={<SleepIcon size={28} color={semanticColors.dashboardIcon.sleep} />}
            backgroundClassName={DASHBOARD_INSIGHT_SURFACE.sleep}
          />
          <DashboardInsightCard
            eyebrow={t('dashboard_insight_heat_eyebrow')}
            title={t('dashboard_insight_heat_title')}
            description={t('dashboard_insight_heat_description')}
            icon={<FlameIcon size={28} color={semanticColors.dashboardIcon.insight} />}
            backgroundClassName={DASHBOARD_INSIGHT_SURFACE.heat}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};
