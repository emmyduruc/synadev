import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ChevronUpIconProps = {
  size?: number;
  color?: string;
};

export const ChevronUpIcon = ({
  size = 18,
  color = semanticColors.foreground,
}: ChevronUpIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 14L12 8L18 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
