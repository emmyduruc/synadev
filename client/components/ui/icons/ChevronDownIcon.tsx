import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ChevronDownIconProps = {
  size?: number;
  color?: string;
};

export const ChevronDownIcon = ({
  size = 18,
  color = semanticColors.foreground,
}: ChevronDownIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 10L12 16L18 10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
