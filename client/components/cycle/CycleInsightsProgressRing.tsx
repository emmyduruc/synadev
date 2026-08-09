import type { ReactNode } from 'react';
import { Svg, Circle } from 'react-native-svg';

import { Box } from '@/components/ui/Box';
import { semanticColors } from '@/lib/ui';

export type CycleInsightsProgressRingProps = {
  progressPercent: number;
  strokeColor: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
};

/**
 * Wide Duolingo-style progress ring for Cycle Insights hero.
 * Thickness and diameter are intentional (not a thin decorative circle).
 */
export const CycleInsightsProgressRing = ({
  progressPercent,
  strokeColor,
  size = 304,
  strokeWidth = 22,
  children,
}: CycleInsightsProgressRingProps) => {
  const normalizedPercent = Math.min(100, Math.max(0, progressPercent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;
  const center = size / 2;

  return (
    <Box
      align="center"
      justify="center"
      style={{ width: size, height: size }}
      className="relative">
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={semanticColors.ovum.lavenderLight}
          strokeWidth={strokeWidth}
          fill={semanticColors.card}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Box
        className="absolute inset-0 px-10"
        align="center"
        justify="center"
        gap="xs">
        {children}
      </Box>
    </Box>
  );
};
