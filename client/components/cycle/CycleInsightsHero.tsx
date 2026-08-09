import type { CyclePhaseId } from '@syna/shared-types';
import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { CycleInsightsProgressRing } from '@/components/cycle/CycleInsightsProgressRing';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type {
  CycleInsightsMilestone,
} from '@/lib/cycle/cycleInsightsProgress';
import { semanticColors } from '@/lib/ui';

export type CycleInsightsHeroProps = {
  phase: CyclePhaseId | null;
  cycleDay: number | null;
  cycleLengthDays: number;
  todayLabel: string;
  statusTitle: string;
  progressPercent: number;
  milestone: CycleInsightsMilestone | null;
  onLogPeriod: () => void;
  onPeriodEnded?: () => void;
};

const ringColorByPhase = (phase: CyclePhaseId | null): string => {
  if (phase === 'period') {
    return semanticColors.splashBackground;
  }

  if (phase === 'ovulation') {
    return semanticColors.ovum.lavender;
  }

  if (phase === 'follicular') {
    return semanticColors.ovum.sageMist;
  }

  if (phase === 'luteal') {
    return semanticColors.ovum.apricot;
  }

  return semanticColors.splashBackground;
};

const glowColorByPhase = (phase: CyclePhaseId | null): string => {
  if (phase === 'period') {
    return semanticColors.splashBackground;
  }

  if (phase === 'ovulation') {
    return semanticColors.ovum.lavender;
  }

  if (phase === 'follicular') {
    return semanticColors.ovum.sageMist;
  }

  if (phase === 'luteal') {
    return semanticColors.ovum.apricot;
  }

  return semanticColors.ovum.lavenderLight;
};

export const CycleInsightsHero = ({
  phase,
  cycleDay,
  cycleLengthDays,
  todayLabel,
  statusTitle,
  progressPercent,
  milestone,
  onLogPeriod,
  onPeriodEnded,
}: CycleInsightsHeroProps) => {
  const { t } = useTranslate();
  const pulse = useSharedValue(0);
  const glowColor = glowColorByPhase(phase);
  const ringColor = ringColorByPhase(phase);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pulse.value, [0, 1], [0.96, 1.04]),
      },
    ],
    opacity: interpolate(pulse.value, [0, 1], [0.22, 0.38]),
  }));

  const milestoneLabel = (() => {
    if (!milestone) {
      return null;
    }

    if (milestone.kind === 'ovulation') {
      return t('cycle_insights_milestone_ovulation', { days: milestone.daysUntil });
    }

    return t('cycle_insights_milestone_period', { days: milestone.daysUntil });
  })();

  return (
    <Box align="center" className="px-3 pb-4 pt-2">
      <Text size="2xs" weight="semibold" color="foreground-muted" align="center">
        {t('cycle_insights_today_label')}
      </Text>
      <Text size="sm" weight="medium" align="center" className="mt-0.5">
        {todayLabel}
      </Text>

      <Box align="center" justify="center" className="mt-4">
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: 280,
              width: 280,
              borderRadius: 140,
              backgroundColor: glowColor,
            },
            glowStyle,
          ]}
        />
        <CycleInsightsProgressRing
          progressPercent={progressPercent}
          strokeColor={ringColor}
          size={304}
          strokeWidth={22}>
          <Text
            size="2xs"
            weight="semibold"
            color="foreground-muted"
            align="center"
            className="uppercase tracking-wide">
            {t('cycle_insights_day_label')}
          </Text>
          <Text
            size="5xl"
            weight="bold"
            align="center"
            color="primary"
            responsive={false}
            className="leading-none">
            {cycleDay !== null ? String(cycleDay) : '-'}
          </Text>
          <Text size="xs" color="foreground-muted" align="center" className="mt-1">
            {t('cycle_insights_of_cycle_length', { length: cycleLengthDays })}
          </Text>
          <Text size="lg" weight="bold" align="center" className="mt-3 leading-tight">
            {statusTitle}
          </Text>
          {milestoneLabel ? (
            <Box className="mt-3 rounded-full bg-primary-500/10 px-3 py-1.5">
              <Text size="2xs" weight="semibold" color="primary" align="center">
                {milestoneLabel}
              </Text>
            </Box>
          ) : null}
        </CycleInsightsProgressRing>
      </Box>

      <Box className="mt-5 w-full gap-2 px-3">
        {phase === 'period' && onPeriodEnded ? (
          <Button fullWidth size="md" onPress={onPeriodEnded}>
            {t('cycle_insights_period_ended_button')}
          </Button>
        ) : null}
        <Button
          fullWidth
          size="md"
          variant={phase === 'period' ? 'outline' : 'primary'}
          onPress={onLogPeriod}>
          {t('cycle_insights_log_period_button')}
        </Button>
      </Box>
    </Box>
  );
};
