import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type SparkleIconProps = {
  size?: number;
  color?: string;
};

export const SparkleIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: SparkleIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13.4 8.6L20 10L13.4 11.4L12 18L10.6 11.4L4 10L10.6 8.6L12 2Z"
      fill={color}
    />
    <Path
      d="M19 3L19.6 5.4L22 6L19.6 6.6L19 9L18.4 6.6L16 6L18.4 5.4L19 3Z"
      fill={color}
      opacity={0.75}
    />
    <Path
      d="M6 16L6.8 18.8L9.6 19.6L6.8 20.4L6 23.2L5.2 20.4L2.4 19.6L5.2 18.8L6 16Z"
      fill={color}
      opacity={0.75}
    />
  </Svg>
);
