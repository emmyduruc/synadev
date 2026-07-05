import { Svg, Circle } from 'react-native-svg';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { semanticColors } from '@/lib/ui';

export type CircularProgressProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
};

export const CircularProgress = ({
  percent,
  size = 72,
  strokeWidth = 7,
}: CircularProgressProps) => {
  const normalizedPercent = Math.min(100, Math.max(0, percent));
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
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={semanticColors.splashBackground}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Box className="absolute inset-0" align="center" justify="center">
        <Text size="sm" weight="bold" color="foreground" responsive={false}>
          {`${normalizedPercent}%`}
        </Text>
      </Box>
    </Box>
  );
};
