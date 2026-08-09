import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import {
  getPrimaryCycleDayMarker,
  type CycleDayMarker,
} from '@syna/shared-utils';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CycleInsightsHero } from '@/components/cycle/CycleInsightsHero';
import { CycleInsightsLegend } from '@/components/cycle/CycleInsightsLegend';
import { CycleInsightsNextPhaseCard } from '@/components/cycle/CycleInsightsNextPhaseCard';
import { CycleInsightsStatsRow } from '@/components/cycle/CycleInsightsStatsRow';
import { CycleInsightsTipsCard } from '@/components/cycle/CycleInsightsTipsCard';
import {
  CycleInsightsWeekStrip,
  type CycleInsightsWeekDay,
} from '@/components/cycle/CycleInsightsWeekStrip';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { resolveCycleInsightsProgress } from '@/lib/cycle/cycleInsightsProgress';
import { getCurrentWeekDays } from '@/lib/dashboard/calendarUtils';
import { toDateKey } from '@/lib/date/dateKeys';
import { formatTodayDisplayDate } from '@/lib/date/formatDisplayDate';

export type CycleInsightsContentProps = {
  snapshot: CyclePhaseSnapshotDto | null;
  markersByDate: ReadonlyMap<string, readonly CycleDayMarker[]>;
  onLogPeriod: () => void;
  onOpenCalendar: () => void;
  onLogSymptoms: () => void;
  onPeriodEnded: () => void;
};

const phaseStatusTitleKey = (phase: CyclePhaseSnapshotDto['phase']) => {
  if (phase === 'period') {
    return 'cycle_insights_status_period';
  }

  if (phase === 'follicular') {
    return 'cycle_insights_status_follicular';
  }

  if (phase === 'ovulation') {
    return 'cycle_insights_status_ovulation';
  }

  if (phase === 'luteal') {
    return 'cycle_insights_status_luteal';
  }

  return 'cycle_insights_status_unknown';
};

export const CycleInsightsContent = ({
  snapshot,
  markersByDate,
  onLogPeriod,
  onOpenCalendar,
  onLogSymptoms,
  onPeriodEnded,
}: CycleInsightsContentProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);

  const weekDays: CycleInsightsWeekDay[] = useMemo(() => {
    const days = getCurrentWeekDays(today);

    return days.map((day, index) => {
      const dateKey = toDateKey(day.date);
      const markers = markersByDate.get(dateKey) ?? [];

      return {
        dateKey,
        dayNumber: day.date.getDate(),
        weekdayIndex: index,
        isToday: dateKey === todayKey,
        primaryMarker: getPrimaryCycleDayMarker(markers),
      };
    });
  }, [markersByDate, today, todayKey]);

  const insightsProgress = useMemo(
    () => resolveCycleInsightsProgress(snapshot, todayKey),
    [snapshot, todayKey],
  );

  const todayLabel = formatTodayDisplayDate(today);
  const phase = snapshot?.phase ?? null;
  const cycleLengthDays = snapshot?.cycleLengthDays ?? 28;
  const periodLengthDays = snapshot?.periodLengthDays ?? 5;

  const daysUntilNextPeriod = (() => {
    if (!snapshot?.nextPeriodDateKey) {
      return null;
    }

    const next = new Date(`${snapshot.nextPeriodDateKey}T12:00:00`);
    const diffMs = next.getTime() - new Date(`${todayKey}T12:00:00`).getTime();
    return Math.max(0, Math.round(diffMs / 86_400_000));
  })();

  const nextPeriodDateLabel = snapshot?.nextPeriodDateKey
    ? formatTodayDisplayDate(new Date(`${snapshot.nextPeriodDateKey}T12:00:00`))
    : null;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: safeAreaBottom + 28 }}>
      <CycleInsightsHero
        phase={phase}
        cycleDay={snapshot?.cycleDay ?? null}
        cycleLengthDays={cycleLengthDays}
        todayLabel={todayLabel}
        statusTitle={t(phaseStatusTitleKey(phase))}
        progressPercent={insightsProgress.progressPercent}
        milestone={insightsProgress.milestone}
        onLogPeriod={onLogPeriod}
        onPeriodEnded={onPeriodEnded}
      />

      <Box paddingX="md" gap="md">
        <CycleInsightsNextPhaseCard
          nextPhase={insightsProgress.nextPhase}
          cycleDay={snapshot?.cycleDay ?? null}
          cycleLengthDays={cycleLengthDays}
        />
        <CycleInsightsStatsRow
          cycleLengthDays={cycleLengthDays}
          periodLengthDays={periodLengthDays}
          ovulationDay={snapshot?.ovulationDay ?? null}
          hasPeriodData={snapshot?.hasPeriodData ?? false}
        />
        <CycleInsightsWeekStrip days={weekDays} />
        <CycleInsightsLegend />
        <CycleInsightsTipsCard
          phase={phase}
          nextPeriodDateLabel={nextPeriodDateLabel}
          daysUntilNextPeriod={daysUntilNextPeriod}
          onLogSymptoms={onLogSymptoms}
        />

        <Button fullWidth variant="outline" size="sm" onPress={onOpenCalendar}>
          {t('cycle_insights_open_calendar_button')}
        </Button>

        <Text size="2xs" color="foreground-muted" align="center" className="leading-snug">
          {t('cycle_insights_footer_note')}
        </Text>
      </Box>
    </ScrollView>
  );
};
