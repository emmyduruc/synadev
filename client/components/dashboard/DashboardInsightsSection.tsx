import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { DashboardInsightCard } from './DashboardInsightCard';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useDashboardInsights } from '@/hooks/useDashboardInsights';
import { useTranslate } from '@/hooks/useTranslate';
import {
  dashboardHorizontalScrollContentStyle,
  dashboardHorizontalScrollStyle,
} from '@/lib/dashboard/horizontalScrollStyles';
import { DASHBOARD_INSIGHT_SURFACE } from '@/lib/dashboard/surfaces';
import type { DashboardInsightCardModel } from '@/lib/insights/buildDashboardInsights';
import { renderInsightIcon } from '@/lib/insights/insightIcons';
import { semanticColors } from '@/lib/ui';

const formatInsightDate = (dateKey: string, language: string): string => {
  const date = new Date(`${dateKey}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(language, {
    day: 'numeric',
    month: 'short',
  });
};

const resolveTitle = (
  insight: DashboardInsightCardModel,
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  const params: Record<string, string | number> = {
    ...(insight.titleParams ?? {}),
  };

  if (insight.severityLabelKey) {
    params.severity = t(insight.severityLabelKey);
  }

  if (insight.phaseLabelKey) {
    params.phase = t(insight.phaseLabelKey);
  }

  return t(insight.titleKey, params);
};

const resolveDescription = (
  insight: DashboardInsightCardModel,
  t: (key: string, options?: Record<string, unknown>) => string,
  language: string,
): string => {
  const params: Record<string, string | number> = {
    ...(insight.descriptionParams ?? {}),
  };

  if (insight.phaseLabelKey) {
    params.phase = t(insight.phaseLabelKey);
  }

  if (typeof params.date === 'string') {
    params.date = formatInsightDate(params.date, language);
  }

  return t(insight.descriptionKey, params);
};

export const DashboardInsightsSection = () => {
  const { t, language } = useTranslate();
  const router = useRouter();
  const { insights, isLoading } = useDashboardInsights();

  if (isLoading || insights.length === 0) {
    return null;
  }

  return (
    <Box gap="sm">
      <Box gap="xs">
        <Text size="lg" weight="bold">
          {t('dashboard_insights_title')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('dashboard_insights_subtitle')}
        </Text>
      </Box>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={dashboardHorizontalScrollStyle}
        contentContainerStyle={dashboardHorizontalScrollContentStyle}>
        <Box direction="row" className="pr-2">
          {insights.map((insight) => (
            <DashboardInsightCard
              key={insight.id}
              eyebrow={t(insight.eyebrowKey)}
              title={resolveTitle(insight, t)}
              description={resolveDescription(insight, t, language)}
              icon={renderInsightIcon(insight.iconKey, {
                size: 20,
                color: semanticColors.dashboardIcon.insight,
              })}
              backgroundClassName={DASHBOARD_INSIGHT_SURFACE[insight.surfaceKey]}
              onPress={() => {
                router.push(insight.href);
              }}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};
