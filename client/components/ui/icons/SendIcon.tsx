import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type SendIconProps = {
  size?: number;
  color?: string;
};

export const SendIcon = ({
  size = 20,
  color = semanticColors.iconOnPrimary,
}: SendIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 11.25L19.5 4.5L12.75 19.5L11.25 13.5L4.5 11.25Z"
      fill={color}
    />
    <Path
      d="M11.25 13.5L19.5 4.5"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.9}
    />
  </Svg>
);
