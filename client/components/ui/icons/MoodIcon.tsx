import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MoodIconProps = {
  size?: number;
  color?: string;
};

export const MoodIcon = ({
  size = 24,
  color = semanticColors.ovum.apricot,
}: MoodIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
    <Circle cx={9} cy={10} r={1.2} fill={color} />
    <Circle cx={15} cy={10} r={1.2} fill={color} />
    <Path
      d="M8.5 14.5C9.6 16.2 10.7 17 12 17C13.3 17 14.4 16.2 15.5 14.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);
