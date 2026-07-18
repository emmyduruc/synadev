import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type FlowerIconProps = {
  size?: number;
  color?: string;
};

export const FlowerIcon = ({
  size = 24,
  color = semanticColors.dashboardIcon.insight,
}: FlowerIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 8C12 5.79 10.21 4 8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12C10.21 12 12 10.21 12 8Z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="M20 8C20 5.79 18.21 4 16 4C13.79 4 12 5.79 12 8C12 10.21 13.79 12 16 12C18.21 12 20 10.21 20 8Z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="M16 20C16 17.79 14.21 16 12 16C9.79 16 8 17.79 8 20C8 22.21 9.79 24 12 24C14.21 24 16 22.21 16 20Z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="M12 12V16M8 12H12M12 8V12M16 12H12"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
