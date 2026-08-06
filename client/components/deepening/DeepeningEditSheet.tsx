import type { ReactNode } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type DeepeningEditSheetProps = {
  visible: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  /** When true, show Done instead of Cancel/Save (caller persists on change). */
  autoSave?: boolean;
  children: ReactNode;
};

export const DeepeningEditSheet = ({
  visible,
  title,
  description,
  onCancel,
  onSave,
  isSaving = false,
  autoSave = false,
  children,
}: DeepeningEditSheetProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}>
      <Box flex={1} background="background" style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" paddingY="sm" gap="xs">
          <Text size="lg" weight="bold" align="center">
            {title}
          </Text>
          {description ? (
            <Text size="xs" color="foreground-muted" align="center">
              {description}
            </Text>
          ) : null}
        </Box>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <Box paddingX="lg" paddingY="md" gap="lg">
            {children}
          </Box>
        </ScrollView>

        {autoSave ? (
          <Box style={{ paddingBottom: safeAreaBottom + 12 }} paddingX="lg">
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onCancel}
              className="items-center py-3">
              <Text size="base" weight="medium" color="primary">
                {t('deepening_sheet_done_button')}
              </Text>
            </TouchableOpacity>
          </Box>
        ) : (
          <Box style={{ paddingBottom: safeAreaBottom }}>
            <ModalCancelSaveFooter
              onCancel={onCancel}
              onSave={onSave}
              isSaving={isSaving}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};
