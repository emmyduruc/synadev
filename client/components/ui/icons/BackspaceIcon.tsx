import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BackspaceIconProps = {
  size?: number;
  color?: string;
};

export const BackspaceIcon = ({
  size = 22,
  color = semanticColors.foreground,
}: BackspaceIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H9L4 12L9 6Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinejoin="round"
    />
    <Path
      d="M14 10L17 13M17 10L14 13"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
    />
  </Svg>
);
