import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type LutealPhaseIconProps = {
  size?: number;
  color?: string;
};

export const LutealPhaseIcon = ({
  size = 24,
  color = semanticColors.ovum.sageMist,
}: LutealPhaseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 16C6 12.5 8.5 9.5 12 8C15.5 9.5 18 12.5 18 16C18 18.2 15.3 20 12 20C8.7 20 6 18.2 6 16Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path d="M12 8V5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);
