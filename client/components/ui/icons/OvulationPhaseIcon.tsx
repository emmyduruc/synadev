import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type OvulationPhaseIconProps = {
  size?: number;
  color?: string;
};

export const OvulationPhaseIcon = ({
  size = 24,
  color = semanticColors.ovum.apricot,
}: OvulationPhaseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={1.7} />
    <Path
      d="M12 3.5V6M12 18V20.5M3.5 12H6M18 12H20.5M6.2 6.2L7.9 7.9M16.1 16.1L17.8 17.8M17.8 6.2L16.1 7.9M7.9 16.1L6.2 17.8"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </Svg>
);
