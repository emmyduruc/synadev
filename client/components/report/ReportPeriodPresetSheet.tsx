import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  REPORT_PERIOD_PRESET_OPTIONS,
  type ReportPeriodPresetOptionId,
} from '@/lib/report/reportPeriodPresets';
import { semanticColors } from '@/lib/ui';

export type ReportPeriodPresetSheetProps = {
  visible: boolean;
  selectedPresetId: ReportPeriodPresetOptionId | null;
  onSelectPreset: (presetId: ReportPeriodPresetOptionId) => void;
  onPressCustom: () => void;
  onClose: () => void;
};

export const ReportPeriodPresetSheet = ({
  visible,
  selectedPresetId,
  onSelectPreset,
  onPressCustom,
  onClose,
}: ReportPeriodPresetSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const softButtonStyle = { backgroundColor: semanticColors.report.dataBackground };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Box
            className="rounded-t-3xl bg-card px-5 pt-3"
            style={{ paddingBottom: safeAreaBottom + 20 }}
            gap="md">
            <Box className="items-center pb-1">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box gap="xs">
              <Text size="xl" weight="bold" className="leading-tight">
                {t('report_period_preset_title')}
              </Text>
              <Text size="sm" color="foreground-subtle" className="leading-relaxed">
                {t('report_period_preset_subtitle')}
              </Text>
            </Box>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}>
              {REPORT_PERIOD_PRESET_OPTIONS.map((option) => {
                const isSelected = selectedPresetId === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => onSelectPreset(option.id)}
                    className="rounded-2xl border px-4 py-3.5"
                    style={{
                      borderColor: isSelected
                        ? semanticColors.foreground
                        : semanticColors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }}>
                    <Box direction="row" align="center" gap="sm">
                      <Box className="min-w-0 flex-1" direction="row" align="center" gap="sm">
                        <Text size="sm" weight="bold" color="foreground">
                          {t(option.titleKey)}
                        </Text>
                        <Text
                          size="sm"
                          color="foreground-muted"
                          className="min-w-0 flex-1 leading-relaxed">
                          {t(option.descriptionKey)}
                        </Text>
                      </Box>
                      {isSelected ? (
                        <CheckIcon size={18} color={semanticColors.foreground} />
                      ) : null}
                    </Box>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View
              style={{
                height: 1,
                backgroundColor: semanticColors.report.hairline,
              }}
            />

            <Button
              variant="outline"
              fullWidth
              size="lg"
              onPress={onPressCustom}
              style={softButtonStyle}
              className="rounded-2xl border-0"
              textClassName="text-foreground">
              {t('report_period_preset_custom')}
            </Button>

            <Box gap="sm">
              <Text size="xs" color="foreground-subtle" className="leading-relaxed">
                {t('report_period_preset_backfill_note')}
              </Text>
              <Text size="xs" color="foreground-subtle" className="leading-relaxed">
                {t('report_period_preset_limits_note')}
              </Text>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
