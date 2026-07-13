import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type StepsIconProps = {
  size?: number;
  color?: string;
};

export const StepsIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: StepsIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 4.5C8.5 3.12 9.62 2 11 2C12.38 2 13.5 3.12 13.5 4.5C13.5 5.88 12.38 7 11 7C9.62 7 8.5 5.88 8.5 4.5Z"
      fill={color}
    />
    <Path
      d="M6 10.5C6 9.12 7.12 8 8.5 8H13.5C14.88 8 16 9.12 16 10.5V12H6V10.5Z"
      fill={color}
      opacity={0.85}
    />
    <Path
      d="M15.5 14.5C15.5 13.12 16.62 12 18 12C19.38 12 20.5 13.12 20.5 14.5C20.5 15.88 19.38 17 18 17C16.62 17 15.5 15.88 15.5 14.5Z"
      fill={color}
    />
    <Path
      d="M13 18.5C13 17.12 14.12 16 15.5 16H20.5C21.88 16 23 17.12 23 18.5V20H13V18.5Z"
      fill={color}
      opacity={0.85}
    />
  </Svg>
);
