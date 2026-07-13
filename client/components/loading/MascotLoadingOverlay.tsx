import { useEffect } from 'react';
import { Modal } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Box } from '@/components/ui/Box';
import { MascotBearIcon } from '@/components/ui/icons/MascotBearIcon';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  LOADING_VARIANT_MESSAGE_KEY,
  LOADING_VARIANT_TITLE_KEY,
  MASCOT_LOADING_ENTER_MS,
  MASCOT_LOADING_FADE_MS,
  type LoadingVariant,
} from '@/lib/loading/loadingVariants';

export type MascotLoadingOverlayProps = {
  variant: LoadingVariant;
  isExiting: boolean;
  /** When true, uses a native Modal so the overlay covers stack modals app-wide. */
  useModal?: boolean;
};

export const MascotLoadingOverlay = ({
  variant,
  isExiting,
  useModal = false,
}: MascotLoadingOverlayProps) => {
  const { t } = useTranslate();
  const bounceY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 420, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 420, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [bounceY]);

  useEffect(() => {
    if (isExiting) {
      overlayOpacity.value = withTiming(0, {
        duration: MASCOT_LOADING_FADE_MS,
        easing: Easing.out(Easing.quad),
      });
      return;
    }

    overlayOpacity.value = withTiming(1, {
      duration: MASCOT_LOADING_ENTER_MS,
      easing: Easing.out(Easing.quad),
    });
  }, [isExiting, overlayOpacity]);

  const bearStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const content = (
    <Animated.View
      pointerEvents="auto"
      className="absolute inset-0 z-50 items-center justify-center bg-lavender-light"
      style={overlayStyle}>
      <Box align="center" gap="lg" paddingX="xl" className="max-w-sm">
        <Animated.View style={bearStyle}>
          <MascotBearIcon size={128} />
        </Animated.View>
        <Box align="center" gap="sm">
          <Text size="2xl" weight="bold" align="center">
            {t(LOADING_VARIANT_TITLE_KEY[variant])}
          </Text>
          <Text size="base" color="foreground-muted" align="center" className="leading-relaxed">
            {t(LOADING_VARIANT_MESSAGE_KEY[variant])}
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );

  if (useModal) {
    return (
      <Modal visible transparent animationType="none" statusBarTranslucent>
        <Box className="flex-1 bg-lavender-light">{content}</Box>
      </Modal>
    );
  }

  return content;
};
