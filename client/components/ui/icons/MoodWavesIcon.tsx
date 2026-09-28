import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MoodWavesIconProps = {
  size?: number;
  color?: string;
};

export const MoodWavesIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: MoodWavesIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8C6.2 5.8 8.8 5.8 11 8C13.2 10.2 15.8 10.2 18 8C19 7 20 6.5 21 6.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 12C6.2 9.8 8.8 9.8 11 12C13.2 14.2 15.8 14.2 18 12C19 11 20 10.5 21 10.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 16C6.2 13.8 8.8 13.8 11 16C13.2 18.2 15.8 18.2 18 16C19 15 20 14.5 21 14.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
