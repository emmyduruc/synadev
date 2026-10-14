import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type HomeWelcomeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectComplaints: () => void;
  onSelectLater: () => void;
};

export const HomeWelcomeModal = ({
  visible,
  onClose,
  onSelectComplaints,
  onSelectLater,
}: HomeWelcomeModalProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-md"
          style={{ marginBottom: Math.max(safeAreaBottom, 0) }}>
          <Box
            className="overflow-hidden rounded-3xl px-5 pt-5 pb-6"
            style={{ backgroundColor: semanticColors.page.DEFAULT }}
            gap="lg">
            <Box direction="row" align="start" justify="between" gap="md">
              <Box flex={1}>
                <Text size="xl" weight="bold" family="serif" className="leading-tight">
                  {t('home_welcome_modal_title')}
                </Text>
              </Box>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('home_welcome_modal_close_accessibility_label')}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                onPress={onClose}>
                <CloseIcon size={22} color={semanticColors.foregroundMuted} />
              </TouchableOpacity>
            </Box>

            <Box gap="md">
              <Text size="sm" color="foreground-muted" family="sans" className="leading-relaxed">
                {t('home_welcome_modal_body_history')}
              </Text>
              <Text size="sm" color="foreground-muted" family="sans" className="leading-relaxed">
                {t('home_welcome_modal_body_next')}
              </Text>
            </Box>

            <Box gap="md" className="pt-1">
              <Button fullWidth size="lg" variant="primary" onPress={onSelectComplaints}>
                {t('home_welcome_modal_select_complaints')}
              </Button>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onSelectLater}
                className="items-center py-1">
                <Text size="base" weight="medium" className="text-foreground">
                  {t('home_welcome_modal_select_later')}
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
