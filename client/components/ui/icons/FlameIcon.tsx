import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type FlameIconProps = {
  size?: number;
  color?: string;
};

export const FlameIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: FlameIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3C12 3 8 8 8 12.5C8 16.1 9.8 19 12 19C14.2 19 16 16.1 16 12.5C16 8 12 3 12 3Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M12 19C12 19 10 16.5 10 14.5C10 12.8 11 11.5 12 11.5C13 11.5 14 12.8 14 14.5C14 16.5 12 19 12 19Z"
      fill={color}
      opacity={0.35}
    />
  </Svg>
);
