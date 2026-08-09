import type { PatternContextResult } from '@syna/shared-utils';
import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatternsSparkline } from '@/components/patterns/PatternsSparkline';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type PatternsLearnMoreSheetProps = {
  context: PatternContextResult | null;
  visible: boolean;
  onClose: () => void;
};

export const PatternsLearnMoreSheet = ({
  context,
  visible,
  onClose,
}: PatternsLearnMoreSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  if (!context) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Box
            className="rounded-t-3xl bg-card px-5 pt-4"
            style={{ paddingBottom: safeAreaBottom + 20 }}
            gap="md">
            <Text size="lg" weight="bold">
              {t(context.titleKey)}
            </Text>
            <Text size="sm" color="foreground" className="leading-relaxed">
              {t(context.learnMoreKey)}
            </Text>
            <Box direction="row" justify="between">
              <PatternsSparkline
                points={context.sparklineA}
                width={140}
                height={48}
                color={semanticColors.ovum.lavender}
              />
              <PatternsSparkline
                points={context.sparklineB}
                width={140}
                height={48}
                color={semanticColors.splashBackground}
              />
            </Box>
            <Text size="2xs" color="foreground-muted">
              {t('patterns_disclaimer')}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onClose}
              className="items-center rounded-2xl bg-primary-500 py-3">
              <Text size="sm" weight="semibold" color="white">
                {t('patterns_close_button')}
              </Text>
            </TouchableOpacity>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
