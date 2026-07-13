import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BURST_DURATION_MS = 2200;

export type ConfettiParticleProps = {
  index: number;
  palette: readonly string[];
  screenWidth: number;
  screenHeight: number;
};

export const ConfettiParticle = ({
  index,
  palette,
  screenWidth,
  screenHeight,
}: ConfettiParticleProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-40);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const color = palette[index % palette.length] ?? palette[0];
  const startX = (index / 36) * screenWidth;
  const drift = ((index % 5) - 2) * 28;
  const size = 6 + (index % 4) * 2;
  const isCircle = index % 3 === 0;

  useEffect(() => {
    const particleDelay = (index % 8) * 35;

    opacity.value = withDelay(
      particleDelay,
      withSequence(
        withTiming(1, { duration: 120 }),
        withDelay(BURST_DURATION_MS - 520, withTiming(0, { duration: 400 })),
      ),
    );
    translateX.value = withDelay(
      particleDelay,
      withTiming(drift, { duration: BURST_DURATION_MS, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      particleDelay,
      withTiming(screenHeight * 0.55, {
        duration: BURST_DURATION_MS,
        easing: Easing.in(Easing.quad),
      }),
    );
    rotate.value = withDelay(
      particleDelay,
      withSequence(
        withTiming(180, { duration: BURST_DURATION_MS / 2 }),
        withTiming(360, { duration: BURST_DURATION_MS / 2 }),
      ),
    );
  }, [drift, index, opacity, rotate, screenHeight, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: screenHeight * 0.18,
          width: size,
          height: isCircle ? size : size * 1.6,
          borderRadius: isCircle ? size / 2 : 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};
