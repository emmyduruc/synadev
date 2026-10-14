import { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { semanticColors } from '@/lib/ui';

const RECT_SIZE_PX = 15;
const WAVE_STEP_MS = 120;
const PULSE_MS = 480;
const OPACITY_DIM = 0.35;
const OPACITY_BRIGHT = 1;

export type RectLoadingBarProps = {
  index: number;
};

export const RectLoadingBar = ({ index }: RectLoadingBarProps) => {
  const opacity = useSharedValue(OPACITY_DIM);

  useEffect(() => {
    opacity.value = withDelay(
      index * WAVE_STEP_MS,
      withRepeat(
        withSequence(
          withTiming(OPACITY_BRIGHT, {
            duration: PULSE_MS,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(OPACITY_DIM, {
            duration: PULSE_MS,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        -1,
        false,
      ),
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [index, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: RECT_SIZE_PX,
          height: RECT_SIZE_PX * 1.6,
          borderRadius: 4,
          backgroundColor: semanticColors.splashBackground,
        },
        style,
      ]}
    />
  );
};
