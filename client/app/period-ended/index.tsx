import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DailyLogDatePicker } from '@/components/dailyLog/DailyLogDatePicker';
import { DailyLogModal } from '@/components/dailyLog/DailyLogModal';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { formatTodayDisplayDate } from '@/lib/date/formatDisplayDate';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import {
  applyPeriodEndDate,
  countDaysInclusive,
  findActivePeriodCluster,
} from '@/lib/period/endPeriodCluster';

/**
 * Smooth “period ended” flow: pick last bleed day, auto-fill the active cluster.
 */
const PeriodEndedScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { dateKeys, isLoading, persist } = usePeriodDates();

  const todayKey = toDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [isSaving, setIsSaving] = useState(false);
  const [hasHydratedDefault, setHasHydratedDefault] = useState(false);

  const activeCluster = useMemo(
    () => findActivePeriodCluster([...dateKeys], todayKey),
    [dateKeys, todayKey],
  );

  useEffect(() => {
    if (isLoading || hasHydratedDefault) {
      return;
    }

    if (activeCluster) {
      const defaultEnd =
        todayKey < activeCluster.startDateKey ? activeCluster.startDateKey : todayKey;
      setSelectedDateKey(defaultEnd);
    }

    setHasHydratedDefault(true);
  }, [activeCluster, hasHydratedDefault, isLoading, todayKey]);

  const previewDayCount = useMemo(() => {
    if (!activeCluster || selectedDateKey < activeCluster.startDateKey) {
      return 0;
    }

    return countDaysInclusive(activeCluster.startDateKey, selectedDateKey);
  }, [activeCluster, selectedDateKey]);

  const isEndBeforeStart = Boolean(
    activeCluster && selectedDateKey < activeCluster.startDateKey,
  );

  const handleSave = useCallback(async () => {
    if (isSaving || !activeCluster || isEndBeforeStart) {
      return;
    }

    setIsSaving(true);

    try {
      const result = applyPeriodEndDate(dateKeys, selectedDateKey, todayKey);

      if (!result) {
        return;
      }

      await persist(result.nextDateKeys);
      celebrate(CONFETTI_ACTION.periodLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [
    activeCluster,
    celebrate,
    dateKeys,
    isEndBeforeStart,
    isSaving,
    persist,
    router,
    selectedDateKey,
    todayKey,
  ]);

  const startLabel = activeCluster
    ? formatTodayDisplayDate(new Date(`${activeCluster.startDateKey}T12:00:00`))
    : null;

  return (
    <MascotLoadingGate
      enabled
      variant={LOADING_VARIANT.cycleCalendar}
      isReady={!isLoading && hasHydratedDefault}
      className="flex-1">
      <DailyLogModal
        title={t('period_ended_screen_title')}
        selectedDateKey={selectedDateKey}
        onChangeDate={setSelectedDateKey}
        onCancel={() => router.back()}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}
        isSaveDisabled={!activeCluster || isEndBeforeStart}
        showDatePicker={false}>
        <Box gap="sm">
          <Text size="base" weight="bold" className="leading-tight">
            {t('period_ended_heading')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('period_ended_subtitle')}
          </Text>
        </Box>

        {!activeCluster ? (
          <Box className="rounded-2xl border border-border bg-card p-4" gap="sm">
            <Text size="sm" weight="semibold">
              {t('period_ended_no_cluster_title')}
            </Text>
            <Text size="xs" color="foreground-muted" className="leading-snug">
              {t('period_ended_no_cluster_body')}
            </Text>
          </Box>
        ) : (
          <Box gap="md">
            {startLabel ? (
              <Text size="xs" color="foreground" className="leading-snug">
                {t('period_ended_started_on', { date: startLabel })}
              </Text>
            ) : null}

            <DailyLogDatePicker
              selectedDateKey={selectedDateKey}
              onChangeDate={setSelectedDateKey}
            />

            {isEndBeforeStart ? (
              <Text size="xs" color="error" className="leading-snug">
                {t('period_ended_before_start_error')}
              </Text>
            ) : (
              <Box className="rounded-2xl border border-primary-200 bg-primary-500/10 px-3 py-3">
                <Text size="xs" weight="semibold" color="primary" className="leading-snug">
                  {t('period_ended_preview', { days: previewDayCount })}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </DailyLogModal>
    </MascotLoadingGate>
  );
};

export default PeriodEndedScreen;
