import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DailyLogModal } from '@/components/dailyLog/DailyLogModal';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { PeriodBleedingForm } from '@/components/period/PeriodBleedingForm';
import { SymptomEntryDateStrip } from '@/components/symptoms/entry/SymptomEntryDateStrip';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useTranslate } from '@/hooks/useTranslate';
import { isDateKey, toDateKey } from '@/lib/date/dateKeys';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import {
  EMPTY_PERIOD_BLEEDING_DETAILS,
  type PeriodBleedingDetails,
} from '@/lib/period/periodBleedingConstants';
import {
  detailsToPeriodDay,
  periodDayToDetails,
} from '@/lib/period/periodBleedingMappers';

const resolveInitialDateKey = (dateKeyParam: string | string[] | undefined): string => {
  const candidate = Array.isArray(dateKeyParam) ? dateKeyParam[0] : dateKeyParam;

  if (candidate && isDateKey(candidate)) {
    return candidate;
  }

  return toDateKey(new Date());
};

/** Record Period: rectangular date strip + bleeding details form. */
const RecordPeriodScreen = () => {
  const router = useRouter();
  const { dateKey: dateKeyParam } = useLocalSearchParams<{ dateKey?: string }>();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const {
    dateKeys,
    days,
    isLoading: isPeriodLoading,
    persistDays,
  } = usePeriodDates();

  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    resolveInitialDateKey(dateKeyParam),
  );
  const [isBleeding, setIsBleeding] = useState<boolean | null>(null);
  const [details, setDetails] = useState<PeriodBleedingDetails>(
    EMPTY_PERIOD_BLEEDING_DETAILS,
  );
  const [isSaving, setIsSaving] = useState(false);

  const isDataReady = !isPeriodLoading;

  useEffect(() => {
    if (isPeriodLoading) {
      return;
    }

    const existing = days.find((day) => day.dateKey === selectedDateKey);
    setIsBleeding(dateKeys.has(selectedDateKey) ? true : null);
    setDetails(periodDayToDetails(existing));
    // Rehydrate only when the selected day (or first load) changes, not on
    // background refetches that would wipe in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- date-scoped hydrate
  }, [isPeriodLoading, selectedDateKey]);

  const canSave = isBleeding === true;

  const handleChangeDate = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey);
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving || isBleeding !== true) {
      return;
    }

    setIsSaving(true);

    try {
      const nextDays = [
        ...days.filter((day) => day.dateKey !== selectedDateKey),
        detailsToPeriodDay(selectedDateKey, details),
      ].sort((a, b) => a.dateKey.localeCompare(b.dateKey));

      await persistDays(nextDays);
      celebrate(CONFETTI_ACTION.periodLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [
    celebrate,
    days,
    details,
    isBleeding,
    isSaving,
    persistDays,
    router,
    selectedDateKey,
  ]);

  const handleBleedingChange = useCallback((next: boolean) => {
    setIsBleeding(next);

    if (!next) {
      setDetails(EMPTY_PERIOD_BLEEDING_DETAILS);
    }
  }, []);

  const title = useMemo(() => t('record_period_screen_title'), [t]);

  return (
    <MascotLoadingGate
      enabled
      variant={LOADING_VARIANT.cycleCalendar}
      isReady={isDataReady}
      className="flex-1">
      <DailyLogModal
        title={title}
        selectedDateKey={selectedDateKey}
        onChangeDate={handleChangeDate}
        onCancel={() => router.back()}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}
        isSaveDisabled={!canSave}
        showDatePicker={false}>
        <Box gap="lg">
          <Box gap="sm">
            <SymptomEntryDateStrip
              selectedDateKey={selectedDateKey}
              onChangeDate={handleChangeDate}
            />
            <Text size="xs" color="foreground-muted" className="leading-relaxed">
              {t('symptom_entry_tab_hint_period')}
            </Text>
          </Box>

          <PeriodBleedingForm
            dateKey={selectedDateKey}
            isBleeding={isBleeding}
            details={details}
            disabled={isSaving}
            onChangeBleeding={handleBleedingChange}
            onChangeDetails={setDetails}
          />
        </Box>
      </DailyLogModal>
    </MascotLoadingGate>
  );
};

export default RecordPeriodScreen;
