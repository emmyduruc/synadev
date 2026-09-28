import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type ChillsIconProps = {
  size?: number;
  color?: string;
};

/** Six-point asterisk / spark used for Frösteln (chills) in symptom entry. */
export const ChillsIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: ChillsIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3V21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M3 12H21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M5.6 5.6L18.4 18.4"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M18.4 5.6L5.6 18.4"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);
