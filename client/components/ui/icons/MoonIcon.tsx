import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MoonIconProps = {
  size?: number;
  color?: string;
};

export const MoonIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: MoonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5 14.5C16.2 16.3 12.8 16.1 10.7 14C8.6 11.9 8.4 8.5 10.2 6.2C7.1 6.8 4.8 9.7 4.8 13C4.8 16.7 7.8 19.7 11.5 19.7C14.8 19.7 17.6 17.5 18.5 14.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
