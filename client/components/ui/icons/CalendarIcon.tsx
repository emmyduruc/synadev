import { Path, Rect, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type CalendarIconProps = {
  size?: number;
  color?: string;
};

export const CalendarIcon = ({
  size = 24,
  color = semanticColors.foreground,
}: CalendarIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={16} rx={3} stroke={color} strokeWidth={1.8} />
    <Path d="M3 10H21" stroke={color} strokeWidth={1.8} />
    <Path d="M8 3V7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M16 3V7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);
