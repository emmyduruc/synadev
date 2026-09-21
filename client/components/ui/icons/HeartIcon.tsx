import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type HeartIconProps = {
  size?: number;
  color?: string;
};

export const HeartIcon = ({
  size = 24,
  color = semanticColors.foreground,
}: HeartIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20.5C16.5 17.5 19.5 14.2 19.5 10.5C19.5 7.46 16.54 5 12 5C7.46 5 4.5 7.46 4.5 10.5C4.5 14.2 7.5 17.5 12 20.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
