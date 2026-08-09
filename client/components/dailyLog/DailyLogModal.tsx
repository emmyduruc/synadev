import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyLogDatePicker } from './DailyLogDatePicker';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type DailyLogModalProps = {
  title: string;
  selectedDateKey: string;
  onChangeDate: (dateKey: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isSaveDisabled?: boolean;
  /** When false, header only shows the title — place DailyLogDatePicker in children. */
  showDatePicker?: boolean;
  children: ReactNode;
};

export const DailyLogModal = ({
  title,
  selectedDateKey,
  onChangeDate,
  onCancel,
  onSave,
  isSaving = false,
  isSaveDisabled = false,
  showDatePicker = true,
  children,
}: DailyLogModalProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const canSave = !isSaving && !isSaveDisabled;

  return (
    <Box flex={1} fullWidth background="background">
      <Box style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" paddingY="sm">
          <Text size="lg" weight="bold">
            {title}
          </Text>
        </Box>

        {showDatePicker ? (
          <Box paddingX="lg" paddingY="sm">
            <DailyLogDatePicker
              selectedDateKey={selectedDateKey}
              onChangeDate={onChangeDate}
            />
          </Box>
        ) : null}
      </Box>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <Box paddingX="lg" paddingY="md" gap="lg">
          {children}
        </Box>
      </ScrollView>

      <Box
        direction="row"
        align="center"
        justify="between"
        className="border-t border-border bg-card px-2 py-3"
        style={{ paddingBottom: safeAreaBottom + 12 }}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isSaving}
          onPress={onCancel}
          className="min-h-11 justify-center px-4 py-2">
          <Text size="base" color="primary" weight="medium">
            {t('daily_log_cancel_button')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!canSave}
          onPress={onSave}
          className={cn('min-h-11 justify-center px-4 py-2', !canSave && 'opacity-40')}>
          <Text size="base" color="primary" weight="bold">
            {t('daily_log_save_button')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
