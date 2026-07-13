import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type SymptomsIconProps = {
  size?: number;
  color?: string;
};

export const SymptomsIcon = ({
  size = 24,
  color = semanticColors.ovum.lavender,
}: SymptomsIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3V21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M5 8H19"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M7 13H17"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M9 18H15"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M8 6L16 18"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.55}
    />
  </Svg>
);
