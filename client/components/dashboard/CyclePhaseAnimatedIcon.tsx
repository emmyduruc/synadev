import type { CyclePhaseId } from '@syna/shared-types';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Box } from '@/components/ui/Box';
import { FollicularPhaseIcon } from '@/components/ui/icons/FollicularPhaseIcon';
import { LutealPhaseIcon } from '@/components/ui/icons/LutealPhaseIcon';
import { MenstrualPhaseIcon } from '@/components/ui/icons/MenstrualPhaseIcon';
import { OvulationPhaseIcon } from '@/components/ui/icons/OvulationPhaseIcon';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { cn, semanticColors } from '@/lib/ui';

export type CyclePhaseAnimatedIconProps = {
  phase: CyclePhaseId | null;
};

const ICON_SIZE = 28;

export const CyclePhaseAnimatedIcon = ({ phase }: CyclePhaseAnimatedIconProps) => {
  const motion = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    motion.value = 0;
    scale.value = 1;

    if (phase === 'period') {
      motion.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 450, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 450, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );
      return;
    }

    if (phase === 'ovulation') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
      return;
    }

    if (phase === 'follicular') {
      motion.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
      return;
    }

    if (phase === 'luteal') {
      scale.value = withRepeat(
        withSequence(
          withTiming(0.94, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    }
  }, [motion, phase, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: motion.value }, { scale: scale.value }],
  }));

  const wellClassName = (() => {
    if (phase === 'period') {
      return DASHBOARD_ICON_WELL.roseGem;
    }

    if (phase === 'ovulation') {
      return DASHBOARD_ICON_WELL.lavenderGem;
    }

    if (phase === 'follicular') {
      return DASHBOARD_ICON_WELL.sageGem;
    }

    if (phase === 'luteal') {
      return DASHBOARD_ICON_WELL.apricotGem;
    }

    return DASHBOARD_ICON_WELL.roseGem;
  })();

  const icon = (() => {
    if (phase === 'period') {
      return (
        <MenstrualPhaseIcon size={ICON_SIZE} color={semanticColors.dashboardIcon.cycle} />
      );
    }

    if (phase === 'follicular') {
      return <FollicularPhaseIcon size={ICON_SIZE} />;
    }

    if (phase === 'ovulation') {
      return <OvulationPhaseIcon size={ICON_SIZE} />;
    }

    if (phase === 'luteal') {
      return <LutealPhaseIcon size={ICON_SIZE} />;
    }

    return <MenstrualPhaseIcon size={ICON_SIZE} color={semanticColors.dashboardIcon.cycle} />;
  })();

  return (
    <Box
      align="center"
      justify="center"
      className={cn('h-14 w-14 rounded-full', wellClassName)}>
      <Animated.View style={animatedStyle}>{icon}</Animated.View>
    </Box>
  );
};
