import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DailyLogModal } from '@/components/dailyLog/DailyLogModal';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { MoodLogSections } from '@/components/mood/MoodLogSections';
import { useMoodLog } from '@/hooks/useMoodLog';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { EMPTY_MOOD_ENTRY, type MoodEntry, type MoodLogMap } from '@/lib/mood/moodLogStorage';

const MoodScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { logs, isLoading, persist } = useMoodLog();

  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [draft, setDraft] = useState<MoodLogMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (isLoading || hasInitialised.current) {
      return;
    }

    hasInitialised.current = true;
    setDraft({ ...logs });
  }, [isLoading, logs]);

  const entry = useMemo<MoodEntry>(
    () => draft[selectedDateKey] ?? EMPTY_MOOD_ENTRY,
    [draft, selectedDateKey],
  );

  const updateEntry = useCallback(
    (updater: (previous: MoodEntry) => MoodEntry) => {
      setDraft((previous) => {
        const current = previous[selectedDateKey] ?? EMPTY_MOOD_ENTRY;

        return { ...previous, [selectedDateKey]: updater(current) };
      });
    },
    [selectedDateKey],
  );

  const handleSelectPrimary = useCallback(
    (moodId: string) => {
      updateEntry((previous) => {
        if (previous.primaryMood === moodId) {
          return { ...previous, primaryMood: null };
        }

        return {
          ...previous,
          primaryMood: moodId,
          feelings: previous.feelings.filter((id) => id !== moodId),
        };
      });
    },
    [updateEntry],
  );

  const handleToggleFeeling = useCallback(
    (moodId: string) => {
      updateEntry((previous) => {
        const feelings = previous.feelings.includes(moodId)
          ? previous.feelings.filter((id) => id !== moodId)
          : [...previous.feelings, moodId];

        return { ...previous, feelings };
      });
    },
    [updateEntry],
  );

  const handleEnergyChange = useCallback(
    (energy: number) => updateEntry((previous) => ({ ...previous, energy })),
    [updateEntry],
  );

  const handleStressChange = useCallback(
    (stress: number) => updateEntry((previous) => ({ ...previous, stress })),
    [updateEntry],
  );

  const handleNoteChange = useCallback(
    (note: string) => updateEntry((previous) => ({ ...previous, note })),
    [updateEntry],
  );

  const handleSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await persist(draft);
      celebrate(CONFETTI_ACTION.moodLogged);
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [celebrate, draft, isSaving, persist, router]);

  return (
    <DailyLogModal
      title={t('mood_log_title')}
      selectedDateKey={selectedDateKey}
      onChangeDate={setSelectedDateKey}
      onCancel={() => router.back()}
      onSave={() => {
        void handleSave();
      }}
      isSaving={isSaving}>
      <MoodLogSections
        entry={entry}
        onSelectPrimary={handleSelectPrimary}
        onToggleFeeling={handleToggleFeeling}
        onEnergyChange={handleEnergyChange}
        onStressChange={handleStressChange}
        onNoteChange={handleNoteChange}
      />
    </DailyLogModal>
  );
};

export default MoodScreen;
