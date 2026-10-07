import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ClockIconProps = {
  size?: number;
  color?: string;
};

export const ClockIcon = ({
  size = 22,
  color = semanticColors.foregroundMuted,
}: ClockIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={8.1} stroke={color} strokeWidth={1.8} />
    <Path
      d="M12 8.2V12.2L15.1 14.1"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
