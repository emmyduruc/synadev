import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type SleepIconProps = {
  size?: number;
  color?: string;
};

export const SleepIcon = ({
  size = 24,
  color = semanticColors.ovum.apricot,
}: SleepIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 14.5C16.2 16.8 13.2 18 10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C10.8 2 11.58 2.12 12.3 2.34C10.9 3.8 10 5.78 10 8C10 12.42 13.58 16 18 16C18.68 16 19.34 15.92 19.98 15.76C19.34 17.42 18.78 18.52 18 14.5Z"
      fill={color}
    />
  </Svg>
);
