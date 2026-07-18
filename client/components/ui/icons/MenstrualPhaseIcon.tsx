import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MenstrualPhaseIconProps = {
  size?: number;
  color?: string;
};

export const MenstrualPhaseIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: MenstrualPhaseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C12 4 7 10.5 7 14.2C7 17.1 9.2 19.5 12 19.5C14.8 19.5 17 17.1 17 14.2C17 10.5 12 4 12 4Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);
