import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type InsightPatternIconProps = {
  size?: number;
  color?: string;
};

export const InsightPatternIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: InsightPatternIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M12 3L13 6.5L16.5 7.5L13 8.5L12 12L11 8.5L7.5 7.5L11 6.5L12 3Z"
      fill={color}
      opacity={0.45}
    />
  </Svg>
);
