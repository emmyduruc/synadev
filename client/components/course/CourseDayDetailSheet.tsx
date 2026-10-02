import { useRouter } from 'expo-router';
import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { CourseDayDetail } from '@/lib/course/buildCourseDayDetail';
import {
  formatCourseDurationHours,
  formatCourseDurationMinutes,
} from '@/lib/course/buildCourseDayDetail';
import { ROUTES } from '@/lib/routes';

export type CourseDayDetailSheetProps = {
  detail: CourseDayDetail | null;
  visible: boolean;
  onClose: () => void;
};

export const CourseDayDetailSheet = ({
  detail,
  visible,
  onClose,
}: CourseDayDetailSheetProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  if (!detail) {
    return null;
  }

  const nightLabels = detail.nightSymptomLabelKeys.map((key) => t(key)).join(', ');
  const dayLabels = detail.daySymptomLabelKeys.map((key) => t(key)).join(', ');

  const sleepParts: string[] = [];

  if (detail.sleepTotalHours !== null) {
    sleepParts.push(
      t('course_day_detail_sleep_total', {
        duration: formatCourseDurationHours(detail.sleepTotalHours),
      }),
    );
  }

  if (detail.deepSleepHours !== null) {
    sleepParts.push(
      t('course_day_detail_deep_sleep', {
        duration: formatCourseDurationMinutes(detail.deepSleepHours),
      }),
    );
  }

  const handleOpenCalendar = () => {
    onClose();
    router.push(ROUTES.calendar);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Box
            className="rounded-t-3xl bg-card px-5 pt-6"
            style={{ paddingBottom: safeAreaBottom + 24 }}
            gap="md">
            <Text size="xl" weight="bold" className="leading-tight">
              {detail.displayDate}
            </Text>

            <Box gap="xs">
              {nightLabels.length > 0 ? (
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t('course_day_detail_night_prefix')} {nightLabels}
                </Text>
              ) : null}

              {detail.awokeLabelKey ? (
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t('course_day_detail_awoke_prefix')} {t(detail.awokeLabelKey)}
                </Text>
              ) : null}

              {dayLabels.length > 0 ? (
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t('course_day_detail_day_prefix')} {dayLabels}
                </Text>
              ) : null}

              {detail.isBleeding ? (
                <Text size="sm" color="foreground" className="leading-relaxed">
                  {t('course_day_detail_bleeding')}
                </Text>
              ) : null}
            </Box>

            {sleepParts.length > 0 || detail.nightHeartRateBpm !== null ? (
              <Box gap="xs">
                {sleepParts.length > 0 ? (
                  <Text size="sm" color="foreground-muted" className="leading-relaxed">
                    {sleepParts.join(' · ')}
                  </Text>
                ) : null}
                {detail.nightHeartRateBpm !== null ? (
                  <Text size="sm" color="foreground-muted" className="leading-relaxed">
                    {t('course_day_detail_night_hr', {
                      bpm: Math.round(detail.nightHeartRateBpm),
                    })}
                  </Text>
                ) : null}
              </Box>
            ) : null}

            <TouchableOpacity accessibilityRole="button" onPress={handleOpenCalendar}>
              <Text size="sm" weight="bold" color="foreground">
                {t('course_day_detail_open_calendar')}
              </Text>
            </TouchableOpacity>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
