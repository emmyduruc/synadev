import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type ModalCancelSaveFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  cancelLabelKey?: string;
  saveLabelKey?: string;
};

/**
 * Shared cancel / save bar used by edit-period, record-period, and similar modals.
 */
export const ModalCancelSaveFooter = ({
  onCancel,
  onSave,
  isSaving = false,
  cancelLabelKey = 'calendar_cancel_button',
  saveLabelKey = 'calendar_save_button',
}: ModalCancelSaveFooterProps) => {
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
          {t(cancelLabelKey)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={isSaving}
        onPress={onSave}
        className="min-h-11 justify-center px-4 py-2">
        <Text size="base" color="primary" weight="bold">
          {t(saveLabelKey)}
        </Text>
      </TouchableOpacity>
    </Box>
  );
};
