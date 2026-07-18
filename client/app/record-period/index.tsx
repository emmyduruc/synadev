import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DailyLogDatePicker } from '@/components/dailyLog/DailyLogDatePicker';
import { DailyLogModal } from '@/components/dailyLog/DailyLogModal';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { RecordPeriodCycleGuide } from '@/components/period/RecordPeriodCycleGuide';
import { SymptomCategoryAccordion } from '@/components/symptoms/SymptomCategoryAccordion';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { usePeriodDates } from '@/hooks/usePeriodDates';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

/**
 * Record Period modal — single-select date wheel + cycle-critical symptom accordions.
 *
 * Persistence today: SecureStore via usePeriodDates + useSymptomLog.
 * TODO(api): Replace local persists with a single backend mutation that saves
 * cycle dates and symptoms together once the period/symptoms API is ready.
 */
const RecordPeriodScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { dateKeys, isLoading: isPeriodLoading, persist: persistPeriodDates } = usePeriodDates();
  const { logs: symptomLogs, isLoading: isSymptomLoading, persist: persistSymptoms } =
    useSymptomLog();

  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [draftSymptoms, setDraftSymptoms] = useState<SymptomLogMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);

  const isDataReady = !isPeriodLoading && !isSymptomLoading && hasHydratedDraft;

  useEffect(() => {
    if (isPeriodLoading || isSymptomLoading || hasHydratedDraft) {
      return;
    }

    setDraftSymptoms({ ...symptomLogs });
    setHasHydratedDraft(true);
  }, [hasHydratedDraft, isPeriodLoading, isSymptomLoading, symptomLogs]);

  const selectedSymptomIds = useMemo(
    () => new Set(draftSymptoms[selectedDateKey] ?? []),
    [draftSymptoms, selectedDateKey],
  );

  const handleToggleSymptom = useCallback(
    (symptomId: string) => {
      setDraftSymptoms((previous) => {
        const current = new Set(previous[selectedDateKey] ?? []);

        if (current.has(symptomId)) {
          current.delete(symptomId);
        } else {
          current.add(symptomId);
        }

        return { ...previous, [selectedDateKey]: [...current] };
      });
    },
    [selectedDateKey],
  );

  const handleSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      // Local-only for now — see file-level TODO(api) for backend persistence.
      const nextPeriodDates = new Set(dateKeys);
      nextPeriodDates.add(selectedDateKey);
      await persistPeriodDates(nextPeriodDates);
      await persistSymptoms(draftSymptoms);
      celebrate(CONFETTI_ACTION.periodLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [
    celebrate,
    dateKeys,
    draftSymptoms,
    isSaving,
    persistPeriodDates,
    persistSymptoms,
    router,
    selectedDateKey,
  ]);

  return (
    <MascotLoadingGate
      enabled
      variant={LOADING_VARIANT.cycleCalendar}
      isReady={isDataReady}
      className="flex-1">
      <DailyLogModal
        title={t('record_period_screen_title')}
        selectedDateKey={selectedDateKey}
        onChangeDate={setSelectedDateKey}
        onCancel={() => router.back()}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}
        showDatePicker={false}>
        <RecordPeriodCycleGuide />

        <Box gap="sm">
          <DailyLogDatePicker
            selectedDateKey={selectedDateKey}
            onChangeDate={setSelectedDateKey}
          />
        </Box>

        <Box gap="md">
          <Text size="base" weight="bold" className="leading-tight mt-4">
            {t('record_period_symptoms_heading')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('record_period_symptoms_hint')}
          </Text>
          <SymptomCategoryAccordion
            selectedIds={selectedSymptomIds}
            onToggle={handleToggleSymptom}
          />
        </Box>
      </DailyLogModal>
    </MascotLoadingGate>
  );
};

export default RecordPeriodScreen;
