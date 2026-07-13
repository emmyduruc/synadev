import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ChevronRightIconProps = {
  size?: number;
  color?: string;
};

export const ChevronRightIcon = ({
  size = 22,
  color = semanticColors.foregroundMuted,
}: ChevronRightIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
