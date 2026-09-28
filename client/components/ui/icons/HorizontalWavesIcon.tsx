import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type HorizontalWavesIconProps = {
  size?: number;
  color?: string;
};

/** Two horizontal wavy lines (dizziness, bloating, digestion patterns). */
export const HorizontalWavesIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: HorizontalWavesIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9C5.5 6.5 8.5 6.5 11 9C13.5 11.5 16.5 11.5 19 9C20 8 21 7.5 22 7.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 15C5.5 12.5 8.5 12.5 11 15C13.5 17.5 16.5 17.5 19 15C20 14 21 13.5 22 13.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
