import type {
  CyclePhaseSnapshotDto,
  HealthDailyMetricRow,
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
} from '@syna/shared-types';
import { CYCLE_PHASE, HEALTH_METRIC_KEY } from '@syna/shared-types';
import type { Href } from 'expo-router';

import {
  INSIGHT_ICON_KEY,
  INSIGHT_ID,
  INSIGHT_SURFACE_KEY,
  type InsightIconKey,
  type InsightId,
  type InsightSurfaceKey,
} from '@/lib/insights/constants';
import {
  classifyMrsIiTotalSeverity,
  MRS_II_TOTAL_SEVERITY_LABEL_KEYS,
} from '@/lib/mrs/mrsIiTotalSeverity';
import { ROUTES } from '@/lib/routes';

export type DashboardInsightCardModel = {
  id: InsightId;
  eyebrowKey: string;
  titleKey: string;
  titleParams?: Record<string, string | number>;
  /** Translated and injected as `severity` in titleParams. */
  severityLabelKey?: string;
  descriptionKey: string;
  descriptionParams?: Record<string, string | number>;
  /** Translated and injected as `phase` in descriptionParams / titleParams. */
  phaseLabelKey?: string;
  surfaceKey: InsightSurfaceKey;
  iconKey: InsightIconKey;
  href: Href;
};

export type BuildDashboardInsightsInput = {
  mrsSubmission: MrsIiAssessmentSubmission | null;
  pamSubmission: Pam13AssessmentSubmission | null;
  cycleSnapshot: CyclePhaseSnapshotDto | null;
  healthRows: readonly HealthDailyMetricRow[];
};

const PHASE_TITLE_KEY: Record<
  NonNullable<CyclePhaseSnapshotDto['phase']>,
  string
> = {
  [CYCLE_PHASE.period]: 'dashboard_cycle_phase_period',
  [CYCLE_PHASE.follicular]: 'dashboard_cycle_phase_follicular',
  [CYCLE_PHASE.ovulation]: 'dashboard_cycle_phase_ovulation',
  [CYCLE_PHASE.luteal]: 'dashboard_cycle_phase_luteal',
};

const metricValue = (
  row: HealthDailyMetricRow,
  key: (typeof HEALTH_METRIC_KEY)[keyof typeof HEALTH_METRIC_KEY],
): number | null => {
  const metric = row.metrics[key];

  if (!metric || metric.value === null || !Number.isFinite(metric.value)) {
    return null;
  }

  return metric.value;
};

const sleepHoursFromRow = (row: HealthDailyMetricRow): number | null => {
  const analysis = metricValue(row, HEALTH_METRIC_KEY.sleepAnalysis);
  if (analysis !== null) {
    return analysis;
  }

  return metricValue(row, HEALTH_METRIC_KEY.sleepSessions);
};

const hrvMsFromRow = (row: HealthDailyMetricRow): number | null => {
  const sdnn = metricValue(row, HEALTH_METRIC_KEY.hrvSdnn);
  if (sdnn !== null) {
    return sdnn;
  }

  return metricValue(row, HEALTH_METRIC_KEY.hrvRmssd);
};

const average = (values: readonly number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
};

const formatOneDecimal = (value: number): string =>
  (Math.round(value * 10) / 10).toFixed(1);

const formatWhole = (value: number): string => String(Math.round(value));

/**
 * Builds home insight cards from live assessment / cycle / health data.
 * Omits cards when the underlying signal is missing.
 */
export const buildDashboardInsights = (
  input: BuildDashboardInsightsInput,
): DashboardInsightCardModel[] => {
  const insights: DashboardInsightCardModel[] = [];

  if (input.mrsSubmission) {
    const severity = classifyMrsIiTotalSeverity(input.mrsSubmission.total);

    insights.push({
      id: INSIGHT_ID.mrs,
      eyebrowKey: 'dashboard_insight_live_mrs_eyebrow',
      titleKey: 'dashboard_insight_live_mrs_title',
      titleParams: { score: input.mrsSubmission.total },
      severityLabelKey: MRS_II_TOTAL_SEVERITY_LABEL_KEYS[severity],
      descriptionKey: 'dashboard_insight_live_mrs_description',
      surfaceKey: INSIGHT_SURFACE_KEY.mrs,
      iconKey: INSIGHT_ICON_KEY.pattern,
      href: ROUTES.assessment.mrsIiResults,
    });
  }

  if (
    input.pamSubmission &&
    input.pamSubmission.scaledScore !== null &&
    input.pamSubmission.scaledScore !== undefined
  ) {
    insights.push({
      id: INSIGHT_ID.pam,
      eyebrowKey: 'dashboard_insight_live_pam_eyebrow',
      titleKey: 'dashboard_insight_live_pam_title',
      titleParams: { score: formatWhole(input.pamSubmission.scaledScore) },
      descriptionKey: 'dashboard_insight_live_pam_description',
      surfaceKey: INSIGHT_SURFACE_KEY.pam,
      iconKey: INSIGHT_ICON_KEY.flower,
      href: ROUTES.tabs.patterns,
    });
  }

  const sleepValues = input.healthRows
    .map(sleepHoursFromRow)
    .filter((value): value is number => value !== null);
  const avgSleep = average(sleepValues);

  if (avgSleep !== null) {
    insights.push({
      id: INSIGHT_ID.sleep,
      eyebrowKey: 'dashboard_insight_live_sleep_eyebrow',
      titleKey: 'dashboard_insight_live_sleep_title',
      titleParams: { hours: formatOneDecimal(avgSleep) },
      descriptionKey: 'dashboard_insight_live_sleep_description',
      descriptionParams: { days: sleepValues.length },
      surfaceKey: INSIGHT_SURFACE_KEY.sleep,
      iconKey: INSIGHT_ICON_KEY.sleep,
      href: ROUTES.tabs.patterns,
    });
  }

  const hrvValues = input.healthRows
    .map(hrvMsFromRow)
    .filter((value): value is number => value !== null);
  const avgHrv = average(hrvValues);

  if (avgHrv !== null) {
    insights.push({
      id: INSIGHT_ID.hrv,
      eyebrowKey: 'dashboard_insight_live_hrv_eyebrow',
      titleKey: 'dashboard_insight_live_hrv_title',
      titleParams: { ms: formatWhole(avgHrv) },
      descriptionKey: 'dashboard_insight_live_hrv_description',
      descriptionParams: { days: hrvValues.length },
      surfaceKey: INSIGHT_SURFACE_KEY.hrv,
      iconKey: INSIGHT_ICON_KEY.hrv,
      href: ROUTES.tabs.patterns,
    });
  }

  const snapshot = input.cycleSnapshot;

  if (snapshot?.hasPeriodData) {
    const phase = snapshot.phase;
    const cycleDay = snapshot.cycleDay;

    if (phase === CYCLE_PHASE.period && cycleDay !== null) {
      const daysLeft = Math.max(0, snapshot.periodLengthDays - cycleDay);

      insights.push({
        id: INSIGHT_ID.cycle,
        eyebrowKey: 'dashboard_insight_live_cycle_eyebrow',
        titleKey: 'dashboard_insight_live_cycle_period_title',
        titleParams: { day: cycleDay },
        phaseLabelKey: PHASE_TITLE_KEY[CYCLE_PHASE.period],
        descriptionKey:
          daysLeft === 0
            ? 'dashboard_insight_live_cycle_period_ending_description'
            : 'dashboard_insight_live_cycle_period_description',
        descriptionParams: { days: daysLeft },
        surfaceKey: INSIGHT_SURFACE_KEY.cycle,
        iconKey: INSIGHT_ICON_KEY.period,
        href: ROUTES.cycleInsights,
      });
    } else if (phase !== null && cycleDay !== null) {
      insights.push({
        id: INSIGHT_ID.cycle,
        eyebrowKey: 'dashboard_insight_live_cycle_eyebrow',
        titleKey: 'dashboard_insight_live_cycle_phase_title',
        titleParams: { day: cycleDay },
        phaseLabelKey: PHASE_TITLE_KEY[phase],
        descriptionKey: snapshot.nextPeriodDateKey
          ? 'dashboard_insight_live_cycle_next_description'
          : 'dashboard_insight_live_cycle_phase_description',
        descriptionParams: snapshot.nextPeriodDateKey
          ? { date: snapshot.nextPeriodDateKey }
          : undefined,
        surfaceKey: INSIGHT_SURFACE_KEY.cycle,
        iconKey: INSIGHT_ICON_KEY.period,
        href: ROUTES.cycleInsights,
      });
    } else {
      insights.push({
        id: INSIGHT_ID.cycle,
        eyebrowKey: 'dashboard_insight_live_cycle_eyebrow',
        titleKey: 'dashboard_insight_live_cycle_logged_title',
        descriptionKey: 'dashboard_insight_live_cycle_logged_description',
        surfaceKey: INSIGHT_SURFACE_KEY.cycle,
        iconKey: INSIGHT_ICON_KEY.period,
        href: ROUTES.cycleInsights,
      });
    }
  }

  return insights;
};
