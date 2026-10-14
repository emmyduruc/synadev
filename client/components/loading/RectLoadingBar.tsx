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
const PULSE_MS = 420;

export type RectLoadingBarProps = {
  index: number;
};

export const RectLoadingBar = ({ index }: RectLoadingBarProps) => {
  const opacity = useSharedValue(0.28);

  useEffect(() => {
    opacity.value = withDelay(
      index * WAVE_STEP_MS,
      withRepeat(
        withSequence(
          withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.28, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) }),
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
          backgroundColor: semanticColors.background,
        },
        style,
      ]}
    />
  );
};
