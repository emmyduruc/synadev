import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import { WizardDateWheel } from '@/components/wizard/WizardDateWheel';
import { semanticColors } from '@/lib/ui';

export type BirthDatePickerSheetProps = {
  visible: boolean;
  title: string;
  value: string;
  onChange: (isoDate: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
};

/**
 * Full-date birth picker sheet. Uses overFullScreen so it stacks correctly
 * above profile edit page sheets (nested pageSheet modals break Cancel/Save).
 */
export const BirthDatePickerSheet = ({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onSave,
  saveDisabled = false,
}: BirthDatePickerSheetProps) => {
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <Box flex={1} className="justify-end" style={{ backgroundColor: 'transparent' }}>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          className="absolute inset-0 bg-black/40"
        />
        <Box
          className="w-full max-h-[88%] overflow-hidden rounded-t-3xl"
          style={{ backgroundColor: semanticColors.page.DEFAULT }}>
          <Box style={{ paddingTop: Math.max(safeAreaTop, 12) }}>
            <Box align="center" paddingX="lg" paddingY="sm">
              <Box className="mb-3 h-1 w-10 rounded-full bg-border" />
              <Text size="lg" weight="bold" align="center">
                {title}
              </Text>
            </Box>
          </Box>

          <Box paddingX="lg" paddingY="md">
            <WizardDateWheel value={value} onChange={onChange} />
          </Box>

          <Box style={{ paddingBottom: safeAreaBottom, zIndex: 2 }}>
            <ModalCancelSaveFooter
              onCancel={onCancel}
              onSave={onSave}
              saveDisabled={saveDisabled}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
