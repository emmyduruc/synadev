import type { PatternSparkPoint } from '@syna/shared-utils';
import { Svg, Polyline } from 'react-native-svg';

import { Box } from '@/components/ui/Box';
import { semanticColors } from '@/lib/ui';

export type PatternsSparklineProps = {
  points: readonly PatternSparkPoint[];
  color?: string;
  height?: number;
  width?: number;
};

export const PatternsSparkline = ({
  points,
  color = semanticColors.splashBackground,
  height = 36,
  width = 120,
}: PatternsSparklineProps) => {
  const values = points
    .map((point) => point.value)
    .filter((value): value is number => value !== null);

  if (values.length < 2) {
    return <Box style={{ height, width }} className="rounded-md bg-muted/40" />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (points.length - 1 || 1);

  const polylinePoints = points
    .map((point, index) => {
      const raw = point.value ?? min;
      const y = height - ((raw - min) / range) * (height - 4) - 2;
      const x = index * stepX;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
};
