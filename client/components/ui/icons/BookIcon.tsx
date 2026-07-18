import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BookIconProps = {
  size?: number;
  color?: string;
};

export const BookIcon = ({
  size = 16,
  color = semanticColors.foregroundMuted,
}: BookIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 4.5C5 3.67 5.67 3 6.5 3H18V19.5H6.5C5.67 19.5 5 20.17 5 21V4.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M18 3.5C19.1 3.5 20 4.4 20 5.5V19.5H18V3.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </Svg>
);
