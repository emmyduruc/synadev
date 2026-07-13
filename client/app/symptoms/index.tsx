import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DailyLogModal } from '@/components/dailyLog/DailyLogModal';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { SymptomLogSections } from '@/components/symptoms/SymptomLogSections';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

const SymptomsScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { logs, isLoading, persist } = useSymptomLog();

  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [draft, setDraft] = useState<SymptomLogMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (isLoading || hasInitialised.current) {
      return;
    }

    hasInitialised.current = true;
    setDraft({ ...logs });
  }, [isLoading, logs]);

  const selectedIds = useMemo(
    () => new Set(draft[selectedDateKey] ?? []),
    [draft, selectedDateKey],
  );

  const handleToggle = useCallback(
    (symptomId: string) => {
      setDraft((previous) => {
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
      await persist(draft);
      celebrate(CONFETTI_ACTION.symptomsLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [celebrate, draft, isSaving, persist, router]);

  return (
    <DailyLogModal
      title={t('symptom_log_title')}
      selectedDateKey={selectedDateKey}
      onChangeDate={setSelectedDateKey}
      onCancel={() => router.back()}
      onSave={() => {
        void handleSave();
      }}
      isSaving={isSaving}>
      <SymptomLogSections selectedIds={selectedIds} onToggle={handleToggle} />
    </DailyLogModal>
  );
};

export default SymptomsScreen;
