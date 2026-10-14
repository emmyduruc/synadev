import type {
  SymptomDayEntry,
  SymptomId,
  SymptomIntensity,
} from '@syna/shared-types';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SymptomExtraOptionButtons } from '@/components/symptoms/entry/SymptomExtraOptionButtons';
import { SymptomIntensityRange } from '@/components/symptoms/entry/SymptomIntensityRange';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { StarIcon } from '@/components/ui/icons/StarIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DEFAULT_SYMPTOM_INTENSITY,
  SYMPTOM_INTENSITY_LABEL_KEYS,
} from '@/lib/symptoms/symptomEntryConstants';
import {
  createDayEntry,
  findSymptomOption,
} from '@/lib/symptoms/symptomEntryHelpers';
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
  const [intensity, setIntensity] = useState<SymptomIntensity>(
    DEFAULT_SYMPTOM_INTENSITY,
  );
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [canRemove, setCanRemove] = useState(false);
  const seededForRef = useRef<SymptomId | null>(null);
  const floatingFooterHeight = 72 + safeAreaBottom;

  useEffect(() => {
    if (!visible || !symptomId) {
      seededForRef.current = null;
      return;
    }

    if (seededForRef.current === symptomId) {
      return;
    }

    seededForRef.current = symptomId;
    setIntensity(initialEntry?.intensity ?? DEFAULT_SYMPTOM_INTENSITY);
    setExtras(initialEntry?.extras ?? {});
    setCanRemove(Boolean(initialEntry));
  }, [initialEntry, symptomId, visible]);

  if (!symptomId) {
    return null;
  }

  const option = findSymptomOption(symptomId);
  const title = customLabel ?? (option ? t(option.labelKey) : symptomId);
  const questions = getSymptomExtrasQuestions(symptomId);

  const handleExtraSelect = (key: string, value: string) => {
    setExtras((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = () => {
    onSave(createDayEntry(symptomId, intensity, extras));
    onClose();
  };

  const handleRemove = () => {
    onRemove(symptomId);
    setCanRemove(false);
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
          className="w-full max-h-[90%] overflow-hidden rounded-t-3xl border border-border bg-background"
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box className="px-5 pt-4" gap="md">
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
                <Text size="base" weight="bold" numberOfLines={2} family="serif">
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
          </Box>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: floatingFooterHeight,
            }}>
            <Box gap="lg">
              <SymptomIntensityRange value={intensity} onChange={setIntensity} />

              {questions.length > 0 ? (
                <Box gap="md">
                  {questions.map((question) => (
                    <Box key={question.key} gap="sm">
                      <Text size="sm" weight="medium">
                        {t(question.labelKey)}
                      </Text>
                      <SymptomExtraOptionButtons
                        options={question.options}
                        selectedValue={extras[question.key]}
                        layout={question.layout}
                        onSelect={(value) => handleExtraSelect(question.key, value)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          </ScrollView>

          <View
            pointerEvents="box-none"
            className="absolute inset-x-0 bottom-0 px-5 pt-3"
            style={{
              paddingBottom: Math.max(safeAreaBottom, 16),
              backgroundColor: semanticColors.page.DEFAULT,
            }}>
            <Box direction="row" align="center" gap="md">
              {canRemove ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleRemove}
                  className="shrink py-2 pr-2">
                  <Text size="sm" weight="medium" color="primary">
                    {t('symptom_entry_remove_selection')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Box className="flex-1" />
              )}
              <Box className={canRemove ? 'flex-1' : 'w-full'}>
                <Button fullWidth size="lg" onPress={handleSave}>
                  {t('symptom_entry_intensity_save')}
                </Button>
              </Box>
            </Box>
          </View>
        </Box>
      </Box>
    </Modal>
  );
};
