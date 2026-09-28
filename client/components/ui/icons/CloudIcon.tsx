import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type CloudIconProps = {
  size?: number;
  color?: string;
};

export const CloudIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: CloudIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.5 18H17C19.2 18 21 16.2 21 14C21 11.9 19.4 10.2 17.4 10C16.9 7.7 14.8 6 12.3 6C10.3 6 8.6 7.1 7.8 8.7C5.7 9 4 10.8 4 13C4 15.8 6.2 18 9 18H7.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
