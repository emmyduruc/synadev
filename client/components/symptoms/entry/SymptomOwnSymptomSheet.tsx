import type { CustomSymptom, SymptomCategoryId } from '@syna/shared-types';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput as RNTextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { FONT_FAMILY } from '@/lib/fonts/constants';
import {
  OWN_SYMPTOM_CATEGORY_LABEL_KEY,
  OWN_SYMPTOM_CATEGORY_ORDER,
} from '@/lib/symptoms/symptomEntryConstants';
import { cn, semanticColors } from '@/lib/ui';

export type SymptomOwnSymptomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (symptom: CustomSymptom) => void;
  onSubmit: (input: {
    label: string;
    categoryId: SymptomCategoryId;
  }) => Promise<CustomSymptom>;
};

export const SymptomOwnSymptomSheet = ({
  visible,
  onClose,
  onCreated,
  onSubmit,
}: SymptomOwnSymptomSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [label, setLabel] = useState('');
  const [categoryId, setCategoryId] = useState<
    (typeof OWN_SYMPTOM_CATEGORY_ORDER)[number]
  >('miscellaneous');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setLabel('');
    setCategoryId('miscellaneous');
    setIsCategoryOpen(false);
    setIsSaving(false);
  }, [visible]);

  const canAdd = label.trim().length > 0 && !isSaving;

  const handleAdd = async () => {
    if (!canAdd) {
      return;
    }

    setIsSaving(true);

    try {
      const created = await onSubmit({
        label: label.trim(),
        categoryId,
      });
      onCreated(created);
      onClose();
    } finally {
      setIsSaving(false);
    }
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
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

        <Box
          className="w-full rounded-t-3xl bg-card px-5 pt-4"
          style={{ paddingBottom: Math.max(safeAreaBottom, 16) + 12 }}
          gap="lg">
          <Box align="center">
            <Box className="h-1 w-10 rounded-full bg-border" />
          </Box>

          <Text size="lg" weight="bold">
            {t('symptom_own_sheet_title')}
          </Text>

          <Box gap="sm">
            <Text size="sm" weight="medium">
              {t('symptom_own_designation_label')}
            </Text>
            <Box className="rounded-full border-2 border-primary-500 px-4 py-3">
              <RNTextInput
                value={label}
                onChangeText={setLabel}
                placeholder={t('symptom_own_designation_placeholder')}
                placeholderTextColor={semanticColors.foregroundMuted}
                autoCapitalize="sentences"
                autoCorrect
                maxLength={80}
                style={{
                  fontFamily: FONT_FAMILY.sans.regular,
                  fontSize: 16,
                  color: semanticColors.foreground,
                  padding: 0,
                }}
              />
            </Box>
          </Box>

          <Box gap="sm">
            <Text size="sm" weight="medium">
              {t('symptom_own_category_label')}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded: isCategoryOpen }}
              onPress={() => setIsCategoryOpen((previous) => !previous)}
              className="flex-row items-center justify-between rounded-full border border-border bg-card px-4 py-3.5">
              <Text size="sm" weight="medium">
                {t(OWN_SYMPTOM_CATEGORY_LABEL_KEY[categoryId])}
              </Text>
              <ChevronDownIcon size={18} color={semanticColors.foreground} />
            </TouchableOpacity>

            {isCategoryOpen ? (
              <Box
                className="overflow-hidden rounded-2xl px-1 py-1"
                style={{ backgroundColor: semanticColors.splashBackground }}>
                <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled>
                  {OWN_SYMPTOM_CATEGORY_ORDER.map((optionId) => {
                    const isSelected = optionId === categoryId;

                    return (
                      <TouchableOpacity
                        key={optionId}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => {
                          setCategoryId(optionId);
                          setIsCategoryOpen(false);
                        }}
                        className={cn(
                          'flex-row items-center gap-2 rounded-xl px-3 py-2.5',
                          isSelected && 'bg-primary-400',
                        )}>
                        {isSelected ? (
                          <CheckIcon size={14} color={semanticColors.iconOnPrimary} />
                        ) : (
                          <Box className="w-3.5" />
                        )}
                        <Text size="sm" weight="medium" color="white" responsive={false}>
                          {t(OWN_SYMPTOM_CATEGORY_LABEL_KEY[optionId])}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </Box>
            ) : null}
          </Box>

          <TouchableOpacity
            accessibilityRole="button"
            disabled={!canAdd}
            onPress={() => {
              void handleAdd();
            }}
            className={cn(
              'items-center rounded-full bg-primary-500 py-3.5',
              !canAdd && 'opacity-40',
            )}>
            <Text size="sm" weight="bold" color="white">
              {t('symptom_own_add_button')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Modal>
  );
};
