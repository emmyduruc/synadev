import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type SparkOutlineIconProps = {
  size?: number;
  color?: string;
};

/** Four-point spark outline used for irritable (Gereizt) in mood entry. */
export const SparkOutlineIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: SparkOutlineIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L13.8 10.2L21 12L13.8 13.8L12 21L10.2 13.8L3 12L10.2 10.2L12 3Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
