import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ChevronLeftIconProps = {
  size?: number;
  color?: string;
};

export const ChevronLeftIcon = ({
  size = 22,
  color = semanticColors.foregroundMuted,
}: ChevronLeftIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6L9 12L15 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
