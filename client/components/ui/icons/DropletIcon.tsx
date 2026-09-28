import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type DropletIconProps = {
  size?: number;
  color?: string;
};

export const DropletIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: DropletIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5C12 3.5 6.5 10.5 6.5 14.5C6.5 17.5 8.9 20 12 20C15.1 20 17.5 17.5 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
