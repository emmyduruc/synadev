import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { CourseRowInsight } from '@/lib/course/buildCourseRowInsight';
import { semanticColors } from '@/lib/ui';

export type CourseRowInsightSheetProps = {
  insight: CourseRowInsight | null;
  visible: boolean;
  onClose: () => void;
};

export const CourseRowInsightSheet = ({
  insight,
  visible,
  onClose,
}: CourseRowInsightSheetProps) => {
  const { t } = useTranslate();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  if (!insight) {
    return null;
  }

  const titleKey =
    insight.unit === 'nights'
      ? 'course_row_insight_title_nights'
      : 'course_row_insight_title_days';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Box
            className="rounded-t-3xl px-5 pt-6"
            style={{
              paddingBottom: safeAreaBottom + 24,
              backgroundColor: semanticColors.report.dataBackground,
            }}
            gap="md">
            <Text size="sm" weight="bold" color="foreground" className="leading-relaxed">
              {t(titleKey, {
                count: insight.eventCount,
                label: t(insight.shortLabelKey),
              })}
            </Text>

            {insight.lines.length > 0 ? (
              <Box gap="sm">
                {insight.lines.map((line) => (
                  <Text
                    key={`${line.key}-${String(line.params.count)}`}
                    size="sm"
                    color="foreground"
                    className="leading-relaxed">
                    {t(line.key, line.params)}
                  </Text>
                ))}
              </Box>
            ) : (
              <Text size="sm" color="foreground-muted" className="leading-relaxed">
                {t('course_row_insight_empty')}
              </Text>
            )}

            <TouchableOpacity
              accessibilityRole="button"
              onPress={onClose}
              className="mt-2 self-start">
              <Text size="sm" weight="bold" color="foreground" className="underline">
                {t('course_row_insight_clear_selection')}
              </Text>
            </TouchableOpacity>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
