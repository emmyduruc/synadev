import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type InfoIconProps = {
  size?: number;
  color?: string;
};

export const InfoIcon = ({
  size = 22,
  color = semanticColors.foreground,
}: InfoIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
    <Path
      d="M12 10.5v5.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Circle cx={12} cy={7.5} r={1} fill={color} />
  </Svg>
);
