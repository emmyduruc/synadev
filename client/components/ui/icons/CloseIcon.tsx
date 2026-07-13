import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type CloseIconProps = {
  size?: number;
  color?: string;
};

export const CloseIcon = ({
  size = 24,
  color = semanticColors.foreground,
}: CloseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18M18 6L6 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
