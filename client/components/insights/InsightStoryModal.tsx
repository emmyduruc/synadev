import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InsightMedicalReviewerRow } from './InsightMedicalReviewer';
import { InsightStoryProgressBar } from './InsightStoryProgressBar';
import { InsightStorySlideContent } from './InsightStorySlideContent';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { ChevronUpIcon } from '@/components/ui/icons/ChevronUpIcon';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { InsightContent } from '@/lib/insights/insightTypes';
import { semanticColors } from '@/lib/ui';

export type InsightStoryModalProps = {
  insight: InsightContent;
  activeSlideIndex: number;
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReadNow: () => void;
};

export const InsightStoryModal = ({
  insight,
  activeSlideIndex,
  visible,
  onClose,
  onNext,
  onPrevious,
  onReadNow,
}: InsightStoryModalProps) => {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const activeSlide = insight.storySlides[activeSlideIndex];

  if (!activeSlide) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <SynaGradientBackground>
        <Box flex={1} style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
          <Box className="px-3 pt-2">
            <InsightStoryProgressBar
              slideCount={insight.storySlides.length}
              activeIndex={activeSlideIndex}
            />
          </Box>

          <Box direction="row" align="center" justify="between" className="mt-3 px-6">
            <Text
              size="2xs"
              weight="semibold"
              className="uppercase tracking-wide text-foreground-muted">
              {t(insight.eyebrowKey)}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('insight_story_close_accessibility_label')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              onPress={onClose}>
              <CloseIcon size={22} color={semanticColors.foregroundMuted} />
            </TouchableOpacity>
          </Box>

          <Box flex={1} className="relative mt-2">
            <Box flex={1} className="px-6" pointerEvents="none">
              <InsightStorySlideContent slide={activeSlide} />
            </Box>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('insight_story_previous_accessibility_label')}
              onPress={onPrevious}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '33%',
              }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('insight_story_next_accessibility_label')}
              onPress={onNext}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '67%',
              }}
            />

            <Box
              gap="lg"
              className="absolute bottom-0 left-0 right-0 px-6 pb-4"
              pointerEvents="box-none">
              <Box pointerEvents="none">
                <InsightMedicalReviewerRow
                  reviewer={insight.reviewer}
                  headingKey="insight_story_medical_review_heading"
                />
              </Box>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<ChevronUpIcon size={18} color={semanticColors.foreground} />}
                className="border-white bg-card"
                textClassName="text-foreground"
                onPress={onReadNow}>
                {t('insight_story_read_now_button')}
              </Button>
            </Box>
          </Box>
        </Box>
      </SynaGradientBackground>
    </Modal>
  );
};
