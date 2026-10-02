import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';

export type CourseFrequencyInfoSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const CourseFrequencyInfoSheet = ({
  visible,
  onClose,
}: CourseFrequencyInfoSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Box
            className="rounded-t-3xl bg-card px-5 pt-6"
            style={{ paddingBottom: safeAreaBottom + 20 }}
            gap="md">
            <Text size="xl" weight="bold" className="leading-tight">
              {t('course_frequency_info_title')}
            </Text>

            <Box gap="md">
              <Text size="sm" color="foreground" className="leading-relaxed">
                <Text size="sm" weight="bold" color="foreground">
                  {t('course_frequency_info_entries_label')}{' '}
                </Text>
                {t('course_frequency_info_entries_body')}
              </Text>

              <Text size="sm" color="foreground" className="leading-relaxed">
                <Text size="sm" weight="bold" color="foreground">
                  {t('course_frequency_info_period_label')}{' '}
                </Text>
                {t('course_frequency_info_period_body')}
              </Text>

              <Text size="sm" color="foreground" className="leading-relaxed">
                <Text size="sm" weight="bold" color="foreground">
                  {t('course_frequency_info_not_mentioned_label')}{' '}
                </Text>
                {t('course_frequency_info_not_mentioned_body')}
              </Text>
            </Box>

            <Text size="2xs" color="foreground-muted" className="leading-relaxed">
              {t('course_frequency_info_disclaimer')}
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={onClose}
              className="mt-2 items-center rounded-full bg-foreground py-3.5">
              <Text size="sm" weight="semibold" color="white">
                {t('course_frequency_info_understood')}
              </Text>
            </TouchableOpacity>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
