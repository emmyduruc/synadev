import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type PeriodIconProps = {
  size?: number;
  color?: string;
};

export const PeriodIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: PeriodIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C9.5 4 7.5 6.2 7.5 9C7.5 12.8 12 20 12 20C12 20 16.5 12.8 16.5 9C16.5 6.2 14.5 4 12 4Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
