import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type HrvIconProps = {
  size?: number;
  color?: string;
};

export const HrvIcon = ({
  size = 24,
  color = semanticColors.ovum.lavender,
}: HrvIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20.5C16.5 17.5 19.5 14.2 19.5 10.5C19.5 7.46 16.54 5 12 5C7.46 5 4.5 7.46 4.5 10.5C4.5 14.2 7.5 17.5 12 20.5Z"
      stroke={color}
      strokeWidth={1.8}
    />
    <Path
      d="M7.5 12H9.5L11 9L13.5 15L15 12H16.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
