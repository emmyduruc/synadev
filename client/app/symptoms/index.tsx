import type { CustomSymptom, SymptomDayEntry, SymptomId } from '@syna/shared-types';
import { isSymptomCategoryId } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { SymptomEntryBottomBar } from '@/components/symptoms/entry/SymptomEntryBottomBar';
import { SymptomEntryCategoryList } from '@/components/symptoms/entry/SymptomEntryCategoryList';
import { SymptomEntryDateStrip } from '@/components/symptoms/entry/SymptomEntryDateStrip';
import { SymptomEntryFavoritesSection } from '@/components/symptoms/entry/SymptomEntryFavoritesSection';
import { SymptomEntryFilterChips } from '@/components/symptoms/entry/SymptomEntryFilterChips';
import { SymptomEntryHeader } from '@/components/symptoms/entry/SymptomEntryHeader';
import { SymptomEntryNoneTodayCard } from '@/components/symptoms/entry/SymptomEntryNoneTodayCard';
import { SymptomEntryNoticeBox } from '@/components/symptoms/entry/SymptomEntryNoticeBox';
import { SymptomEntryOftenWithYouSection } from '@/components/symptoms/entry/SymptomEntryOftenWithYouSection';
import { SymptomEntryOwnSymptomButton } from '@/components/symptoms/entry/SymptomEntryOwnSymptomButton';
import { SymptomEntryPeriodMoodPlaceholder } from '@/components/symptoms/entry/SymptomEntryPeriodMoodPlaceholder';
import { SymptomEntryPersistentSection } from '@/components/symptoms/entry/SymptomEntryPersistentSection';
import { SymptomEntryTabs } from '@/components/symptoms/entry/SymptomEntryTabs';
import { SymptomEntryTodayBanner } from '@/components/symptoms/entry/SymptomEntryTodayBanner';
import { SymptomIntensitySheet } from '@/components/symptoms/entry/SymptomIntensitySheet';
import { SymptomOwnSymptomSheet } from '@/components/symptoms/entry/SymptomOwnSymptomSheet';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useCustomSymptoms } from '@/hooks/useCustomSymptoms';
import { useSymptomFavorites } from '@/hooks/useSymptomFavorites';
import { useSymptomLog } from '@/hooks/useSymptomLog';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import {
  DEFAULT_SYMPTOM_INTENSITY,
  SYMPTOM_ENTRY_FILTER,
  SYMPTOM_ENTRY_TAB,
  type SymptomEntryFilterId,
  type SymptomEntryTabId,
} from '@/lib/symptoms/symptomEntryConstants';
import {
  createDayEntry,
  findDayEntry,
  getOftenWithYouSymptomIds,
  removeDayEntry,
  upsertDayEntry,
} from '@/lib/symptoms/symptomEntryHelpers';
import type { SymptomLogMap } from '@/lib/symptoms/symptomLogStorage';

const SymptomsScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { celebrate } = useConfettiCelebration();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const { logs, isLoading, persist } = useSymptomLog();
  const { favoriteIds, toggleFavorite, isFavorite } = useSymptomFavorites();
  const { customSymptoms, addCustomSymptom } = useCustomSymptoms();

  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [draft, setDraft] = useState<SymptomLogMap>({});
  const [activeTab, setActiveTab] = useState<SymptomEntryTabId>(SYMPTOM_ENTRY_TAB.symptoms);
  const [activeFilter, setActiveFilter] = useState<SymptomEntryFilterId>(
    SYMPTOM_ENTRY_FILTER.favorites,
  );
  const [sheetSymptomId, setSheetSymptomId] = useState<SymptomId | null>(null);
  const [isOwnSheetVisible, setIsOwnSheetVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [noneTodayKeys, setNoneTodayKeys] = useState<Record<string, boolean>>({});
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (isLoading || hasInitialised.current) {
      return;
    }

    hasInitialised.current = true;
    setDraft({ ...logs });
  }, [isLoading, logs]);

  const dayEntries = draft[selectedDateKey];
  const selectedCount = dayEntries?.length ?? 0;
  const isNoneToday = Boolean(noneTodayKeys[selectedDateKey]) && selectedCount === 0;

  const customLabelById = useMemo(() => {
    const map = new Map<string, string>();

    for (const symptom of customSymptoms) {
      map.set(symptom.id, symptom.label);
    }

    return map;
  }, [customSymptoms]);

  const oftenIds = useMemo(
    () => getOftenWithYouSymptomIds(logs, favoriteIds),
    [favoriteIds, logs],
  );

  const sheetEntry = sheetSymptomId
    ? findDayEntry(dayEntries, sheetSymptomId)
    : undefined;

  const sheetCustomLabel = sheetSymptomId
    ? customLabelById.get(sheetSymptomId)
    : undefined;

  const handleOpenSymptom = useCallback((symptomId: SymptomId) => {
    setNoneTodayKeys((previous) => ({ ...previous, [selectedDateKey]: false }));
    setSheetSymptomId(symptomId);
  }, [selectedDateKey]);

  const handleSaveEntry = useCallback(
    (entry: SymptomDayEntry) => {
      setDraft((previous) => ({
        ...previous,
        [selectedDateKey]: upsertDayEntry(previous[selectedDateKey], entry),
      }));
      setNoneTodayKeys((previous) => ({ ...previous, [selectedDateKey]: false }));
    },
    [selectedDateKey],
  );

  const handleRemoveEntry = useCallback(
    (symptomId: SymptomId) => {
      setDraft((previous) => {
        const nextEntries = removeDayEntry(previous[selectedDateKey], symptomId);

        if (nextEntries.length === 0) {
          const nextDraft = { ...previous };
          delete nextDraft[selectedDateKey];

          return nextDraft;
        }

        return { ...previous, [selectedDateKey]: nextEntries };
      });
    },
    [selectedDateKey],
  );

  const handleToggleFavorite = useCallback(
    (symptomId: SymptomId) => {
      void toggleFavorite(symptomId);
    },
    [toggleFavorite],
  );

  const handleTogglePersistentPreset = useCallback(
    (symptomId: SymptomId, shouldSelect: boolean) => {
      if (shouldSelect) {
        handleSaveEntry(createDayEntry(symptomId, DEFAULT_SYMPTOM_INTENSITY));
        setSheetSymptomId(symptomId);

        return;
      }

      handleRemoveEntry(symptomId);
    },
    [handleRemoveEntry, handleSaveEntry],
  );

  const handleNoneToday = useCallback(() => {
    setDraft((previous) => {
      const nextDraft = { ...previous };
      delete nextDraft[selectedDateKey];

      return nextDraft;
    });
    setNoneTodayKeys((previous) => ({ ...previous, [selectedDateKey]: true }));
  }, [selectedDateKey]);

  const handleReady = useCallback(async () => {
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

  const handleOwnSymptomCreated = useCallback(
    (symptom: CustomSymptom) => {
      handleSaveEntry(createDayEntry(symptom.id, DEFAULT_SYMPTOM_INTENSITY));
      setSheetSymptomId(symptom.id);
    },
    [handleSaveEntry],
  );

  return (
    <Box flex={1} fullWidth background="background">
      <Box style={{ paddingTop: safeAreaTop }}>
        <SymptomEntryHeader onBack={() => router.back()} />
      </Box>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <Box paddingX="lg" gap="md">
          <SymptomEntryTodayBanner />
          <SymptomEntryDateStrip
            selectedDateKey={selectedDateKey}
            onChangeDate={setSelectedDateKey}
          />
          <SymptomEntryTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {activeTab === SYMPTOM_ENTRY_TAB.symptoms ? (
            <>
              <Box gap="xs">
                <Text size="xl" weight="bold" className="leading-tight">
                  {t('symptom_entry_prompt_title')}
                </Text>
                <Text size="xs" color="foreground-muted" className="leading-relaxed">
                  {t('symptom_entry_prompt_hint')}
                </Text>
              </Box>

              <SymptomEntryFilterChips
                activeFilter={activeFilter}
                onChangeFilter={setActiveFilter}
              />

              {activeFilter === SYMPTOM_ENTRY_FILTER.favorites ? (
                <SymptomEntryFavoritesSection
                  favoriteIds={favoriteIds}
                  dayEntries={dayEntries}
                  onPressSymptom={handleOpenSymptom}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectFavorites={() => {
                    setActiveFilter(SYMPTOM_ENTRY_FILTER.vasomotor);
                  }}
                />
              ) : null}

              {isSymptomCategoryId(activeFilter) ? (
                <SymptomEntryCategoryList
                  categoryId={activeFilter}
                  dayEntries={dayEntries}
                  favoriteIds={favoriteIds}
                  onPressSymptom={handleOpenSymptom}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : null}

              <SymptomEntryOftenWithYouSection
                symptomIds={oftenIds}
                dayEntries={dayEntries}
                favoriteIds={favoriteIds}
                onPressSymptom={handleOpenSymptom}
                onToggleFavorite={handleToggleFavorite}
              />

              <SymptomEntryPersistentSection
                dayEntries={dayEntries}
                favoriteIds={favoriteIds}
                onPressSymptom={handleOpenSymptom}
                onToggleFavorite={handleToggleFavorite}
                onTogglePreset={handleTogglePersistentPreset}
              />

              <SymptomEntryOwnSymptomButton onPress={() => setIsOwnSheetVisible(true)} />

              <SymptomEntryNoneTodayCard
                isSelected={isNoneToday}
                onPress={handleNoneToday}
              />

              <SymptomEntryNoticeBox />
            </>
          ) : (
            <SymptomEntryPeriodMoodPlaceholder tab={activeTab} />
          )}
        </Box>
      </ScrollView>

      <Box style={{ paddingBottom: safeAreaBottom }}>
        <SymptomEntryBottomBar
          selectedCount={selectedCount}
          isSaving={isSaving}
          onReady={() => {
            void handleReady();
          }}
        />
      </Box>

      <SymptomIntensitySheet
        visible={sheetSymptomId !== null}
        symptomId={sheetSymptomId}
        initialEntry={sheetEntry}
        isFavorite={sheetSymptomId ? isFavorite(sheetSymptomId) : false}
        customLabel={sheetCustomLabel}
        onClose={() => setSheetSymptomId(null)}
        onSave={handleSaveEntry}
        onRemove={handleRemoveEntry}
        onToggleFavorite={handleToggleFavorite}
      />

      <SymptomOwnSymptomSheet
        visible={isOwnSheetVisible}
        onClose={() => setIsOwnSheetVisible(false)}
        onSubmit={addCustomSymptom}
        onCreated={handleOwnSymptomCreated}
      />
    </Box>
  );
};

export default SymptomsScreen;
