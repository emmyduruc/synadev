import type { ReactNode } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';

export type ProfileSettingsEditSheetProps = {
  visible: boolean;
  title: string;
  sectionLabel?: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveDisabled?: boolean;
  children: ReactNode;
};

/**
 * Per-section profile edit modal: section fields only, cancel/save footer.
 */
export const ProfileSettingsEditSheet = ({
  visible,
  title,
  sectionLabel,
  onCancel,
  onSave,
  isSaving = false,
  saveDisabled = false,
  children,
}: ProfileSettingsEditSheetProps) => {
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}>
      <Box flex={1} background="background" style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" paddingY="sm">
          <Text size="lg" weight="bold" align="center">
            {title}
          </Text>
        </Box>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <Box paddingX="lg" paddingY="md" gap="lg">
            {sectionLabel ? (
              <Text
                size="2xs"
                weight="semibold"
                color="foreground-muted"
                className="tracking-widest">
                {sectionLabel}
              </Text>
            ) : null}
            {children}
          </Box>
        </ScrollView>

        <Box style={{ paddingBottom: safeAreaBottom }}>
          <ModalCancelSaveFooter
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
            saveDisabled={saveDisabled}
          />
        </Box>
      </Box>
    </Modal>
  );
};
