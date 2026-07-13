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
      d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path
      d="M14 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C8.63 2 8 3.8 8 5.5c0 3.11 2 5.66 2 8.68V16a2 2 0 1 0 4 0Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);
