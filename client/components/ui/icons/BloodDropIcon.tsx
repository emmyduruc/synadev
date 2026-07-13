import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BloodDropIconProps = {
  size?: number;
  color?: string;
};

export const BloodDropIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: BloodDropIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5C12 3.5 7 10.2 7 14C7 17.3 9.2 19.5 12 19.5C14.8 19.5 17 17.3 17 14C17 10.2 12 3.5 12 3.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
