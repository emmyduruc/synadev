import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ActivityIconProps = {
  size?: number;
  color?: string;
};

export const ActivityIcon = ({
  size = 24,
  color = semanticColors.ovum.sageMist,
}: ActivityIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12H6.5L9 6L13 18L15.5 12H21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
