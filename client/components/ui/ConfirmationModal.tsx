import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { type ButtonVariant, semanticColors } from '@/lib/ui';

export type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Defaults to `primary`. Use `danger` for destructive actions. */
  confirmVariant?: ButtonVariant;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

/**
 * Reusable centered confirmation dialog with cancel / confirm actions.
 * Use for sign-out, delete account, and similar irreversible choices.
 */
export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'primary',
  isConfirming = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={onCancel}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-md"
          style={{ marginBottom: Math.max(safeAreaBottom, 0) }}>
          <Box
            className="overflow-hidden rounded-3xl px-5 py-5"
            style={{ backgroundColor: semanticColors.page.DEFAULT }}
            gap="md">
            <Box className="items-center pt-1 pb-1">
              <View className="h-1 w-10 rounded-full bg-border" />
            </Box>

            <Box gap="sm">
              <Text size="xl" weight="bold" family="serif" className="leading-tight">
                {title}
              </Text>
              <Text size="sm" color="foreground-muted" family="sans" className="leading-relaxed">
                {message}
              </Text>
            </Box>

            {children}

            <Box gap="sm" className="pt-1">
              <Button
                fullWidth
                size="lg"
                variant={confirmVariant}
                loading={isConfirming}
                onPress={onConfirm}>
                {confirmLabel}
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="soft"
                disabled={isConfirming}
                onPress={onCancel}>
                {cancelLabel}
              </Button>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
