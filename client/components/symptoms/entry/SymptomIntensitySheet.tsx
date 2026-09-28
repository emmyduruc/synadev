import type { SymptomDayEntry, SymptomId, SymptomIntensity } from '@syna/shared-types';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymptomExtraOptionButtons } from '@/components/symptoms/entry/SymptomExtraOptionButtons';
import { SymptomIntensityRange } from '@/components/symptoms/entry/SymptomIntensityRange';
import { Box } from '@/components/ui/Box';
import { StarIcon } from '@/components/ui/icons/StarIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DEFAULT_SYMPTOM_INTENSITY,
  SYMPTOM_INTENSITY_LABEL_KEYS,
} from '@/lib/symptoms/symptomEntryConstants';
import { createDayEntry, findSymptomOption } from '@/lib/symptoms/symptomEntryHelpers';
import { getSymptomEntryIcon } from '@/lib/symptoms/symptomEntryIcons';
import { getSymptomExtrasQuestions } from '@/lib/symptoms/symptomExtrasConfig';
import { semanticColors } from '@/lib/ui';

export type SymptomIntensitySheetProps = {
  visible: boolean;
  symptomId: SymptomId | null;
  initialEntry?: SymptomDayEntry;
  isFavorite: boolean;
  customLabel?: string;
  onClose: () => void;
  onSave: (entry: SymptomDayEntry) => void;
  onRemove: (symptomId: SymptomId) => void;
  onToggleFavorite: (symptomId: SymptomId) => void;
};

export const SymptomIntensitySheet = ({
  visible,
  symptomId,
  initialEntry,
  isFavorite,
  customLabel,
  onClose,
  onSave,
  onRemove,
  onToggleFavorite,
}: SymptomIntensitySheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [intensity, setIntensity] = useState<SymptomIntensity>(DEFAULT_SYMPTOM_INTENSITY);
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [hasSelection, setHasSelection] = useState(false);
  const seededForRef = useRef<SymptomId | null>(null);

  useEffect(() => {
    if (!visible || !symptomId) {
      seededForRef.current = null;

      return;
    }

    if (seededForRef.current === symptomId) {
      return;
    }

    seededForRef.current = symptomId;
    const nextIntensity = initialEntry?.intensity ?? DEFAULT_SYMPTOM_INTENSITY;
    const nextExtras = initialEntry?.extras ?? {};
    setIntensity(nextIntensity);
    setExtras(nextExtras);
    setHasSelection(true);

    if (!initialEntry) {
      onSave(createDayEntry(symptomId, nextIntensity, nextExtras));
    }
  }, [initialEntry, onSave, symptomId, visible]);

  if (!symptomId) {
    return null;
  }

  const option = findSymptomOption(symptomId);
  const title = customLabel ?? (option ? t(option.labelKey) : symptomId);
  const questions = getSymptomExtrasQuestions(symptomId);

  const persistEntry = (
    nextIntensity: SymptomIntensity,
    nextExtras: Record<string, string>,
  ) => {
    onSave(createDayEntry(symptomId, nextIntensity, nextExtras));
    setHasSelection(true);
  };

  const handleIntensityChange = (nextIntensity: SymptomIntensity) => {
    setIntensity(nextIntensity);
    persistEntry(nextIntensity, extras);
  };

  const handleExtraSelect = (key: string, value: string) => {
    const nextExtras = { ...extras, [key]: value };
    setExtras(nextExtras);
    persistEntry(intensity, nextExtras);
  };

  const handleRemove = () => {
    onRemove(symptomId);
    setHasSelection(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Box className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <Box
          className="w-full max-h-[90%] rounded-t-3xl border border-border bg-background px-5 pt-4"
          style={{ paddingBottom: Math.max(safeAreaBottom, 16) + 12 }}
          gap="md">
          <Box align="center" className="pb-1">
            <Box className="h-1 w-10 rounded-full bg-border" />
          </Box>

          <Box direction="row" align="center" gap="sm">
            <Box
              align="center"
              justify="center"
              className="h-12 w-12 rounded-2xl bg-lavender-light">
              {getSymptomEntryIcon(symptomId)}
            </Box>

            <Box flex={1} gap="xs">
              <Text size="base" weight="bold" numberOfLines={2}>
                {title}
              </Text>
              <Text size="sm" color="foreground-muted">
                {t(SYMPTOM_INTENSITY_LABEL_KEYS[intensity])}
              </Text>
            </Box>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('symptom_entry_favorite_toggle_label')}
              onPress={() => onToggleFavorite(symptomId)}
              className="flex-row items-center gap-1.5 pl-2">
              <StarIcon
                size={20}
                filled={isFavorite}
                color={
                  isFavorite
                    ? semanticColors.splashBackground
                    : semanticColors.foregroundMuted
                }
              />
              <Text size="sm" weight="medium">
                {t('symptom_entry_favorite_button')}
              </Text>
            </TouchableOpacity>
          </Box>

          <Box className="h-px w-full bg-border" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            <Box gap="lg" className="pb-2">
              <SymptomIntensityRange value={intensity} onChange={handleIntensityChange} />

              {questions.length > 0 ? (
                <Box gap="md">
                  <Text size="sm" weight="bold">
                    {t('symptom_entry_extras_heading')}
                  </Text>

                  {questions.map((question) => (
                    <Box key={question.key} gap="sm">
                      <Text size="sm" weight="medium">
                        {t(question.labelKey)}
                      </Text>
                      <SymptomExtraOptionButtons
                        options={question.options}
                        selectedValue={extras[question.key]}
                        onSelect={(value) => handleExtraSelect(question.key, value)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : null}

              {hasSelection ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleRemove}
                  className="items-start py-1">
                  <Text size="sm" weight="medium" color="primary">
                    {t('symptom_entry_remove_selection')}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </Box>
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
};
