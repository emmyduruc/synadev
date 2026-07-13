import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type CalendarEditPeriodFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

export const CalendarEditPeriodFooter = ({
  onCancel,
  onSave,
  isSaving = false,
}: CalendarEditPeriodFooterProps) => {
  const { t } = useTranslate();

  return (
    <Box
      direction="row"
      align="center"
      justify="between"
      className="border-t border-border bg-card px-2 py-3">
      <TouchableOpacity
        accessibilityRole="button"
        disabled={isSaving}
        onPress={onCancel}
        className="min-h-11 justify-center px-4 py-2">
        <Text size="base" color="primary" weight="medium">
          {t('calendar_cancel_button')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={isSaving}
        onPress={onSave}
        className="min-h-11 justify-center px-4 py-2">
        <Text size="base" color="primary" weight="bold">
          {t('calendar_save_button')}
        </Text>
      </TouchableOpacity>
    </Box>
  );
};
