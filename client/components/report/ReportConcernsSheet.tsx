import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReportConcernsFreeTextSection } from '@/components/report/ReportConcernsFreeTextSection';
import { ReportDoctorQuestionOption } from '@/components/report/ReportDoctorQuestionOption';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  REPORT_CONCERN_LIST,
  type ReportConcernId,
} from '@/lib/report/reportConcerns';
import { semanticColors } from '@/lib/ui';

export type ReportConcernsSelection = {
  concernIds: readonly ReportConcernId[];
  freeText: string;
};

export type ReportConcernsSheetProps = {
  visible: boolean;
  selectedConcernIds: readonly ReportConcernId[];
  freeText?: string;
  onClose: () => void;
  onApply: (selection: ReportConcernsSelection) => void;
};

export const ReportConcernsSheet = ({
  visible,
  selectedConcernIds,
  freeText = '',
  onClose,
  onApply,
}: ReportConcernsSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [draftSelectedIds, setDraftSelectedIds] = useState<ReportConcernId[]>([
    ...selectedConcernIds,
  ]);
  const [draftFreeText, setDraftFreeText] = useState(freeText);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftSelectedIds([...selectedConcernIds]);
    setDraftFreeText(freeText);
  }, [freeText, selectedConcernIds, visible]);

  const floatingFooterHeight = 88 + safeAreaBottom;

  const handleToggle = (optionId: string) => {
    const concernId = optionId as ReportConcernId;

    setDraftSelectedIds((previous) => {
      if (previous.includes(concernId)) {
        return previous.filter((id) => id !== concernId);
      }

      return [...previous, concernId];
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="max-h-[92%]"
          onPress={(event) => event.stopPropagation()}
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box
            className="rounded-t-3xl"
            style={{
              backgroundColor: semanticColors.page.DEFAULT,
              maxHeight: '100%',
            }}>
            <Box className="items-center px-5 pt-3 pb-2">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box className="px-5 pb-3" gap="xs">
              <Text size="xl" weight="bold" className="leading-tight">
                {t('report_concerns_sheet_title')}
              </Text>
              <Text size="sm" color="foreground-subtle" className="leading-relaxed">
                {t('report_concerns_sheet_subtitle')}
              </Text>
            </Box>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: floatingFooterHeight,
                gap: 10,
              }}>
              {REPORT_CONCERN_LIST.map((concern) => (
                <ReportDoctorQuestionOption
                  key={concern.id}
                  id={concern.id}
                  labelKey={concern.labelKey}
                  isSelected={draftSelectedIds.includes(concern.id)}
                  onToggle={handleToggle}
                />
              ))}

              <ReportConcernsFreeTextSection
                value={draftFreeText}
                onChangeText={setDraftFreeText}
              />
            </ScrollView>

            <View
              pointerEvents="box-none"
              className="absolute inset-x-0 bottom-0 px-5 pt-3"
              style={{
                paddingBottom: safeAreaBottom + 12,
                backgroundColor: semanticColors.page.DEFAULT,
              }}>
              <Button
                fullWidth
                size="lg"
                onPress={() =>
                  onApply({
                    concernIds: draftSelectedIds,
                    freeText: draftFreeText.trim(),
                  })
                }
                className="border-0"
                style={{ backgroundColor: semanticColors.ink2 }}
                textClassName="text-white">
                {t('report_concerns_apply')}
              </Button>
            </View>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
