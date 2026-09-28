import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type StarIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
};

export const StarIcon = ({
  size = 22,
  color = semanticColors.splashBackground,
  filled = false,
}: StarIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5L14.4 9.1L20.5 9.7L15.9 13.8L17.3 19.8L12 16.7L6.7 19.8L8.1 13.8L3.5 9.7L9.6 9.1L12 3.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={filled ? color : undefined}
    />
  </Svg>
);
