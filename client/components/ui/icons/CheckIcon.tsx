import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type CheckIconProps = {
  size?: number;
  color?: string;
};

export const CheckIcon = ({
  size = 16,
  color = semanticColors.iconOnPrimary,
}: CheckIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 12.5L10.5 17L18 8"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
