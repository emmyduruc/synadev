import { Path, Rect, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BatteryLowIconProps = {
  size?: number;
  color?: string;
};

export const BatteryLowIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: BatteryLowIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={2.5}
      y={7}
      width={16}
      height={10}
      rx={2}
      stroke={color}
      strokeWidth={1.8}
    />
    <Path d="M20.5 10V14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Rect x={4.5} y={9.5} width={4} height={5} rx={0.8} fill={color} />
  </Svg>
);
