import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type VerifiedBadgeIconProps = {
  size?: number;
  backgroundColor?: string;
  checkColor?: string;
};

export const VerifiedBadgeIcon = ({
  size = 18,
  backgroundColor = semanticColors.bannerIcon.success,
  checkColor = semanticColors.iconOnPrimary,
}: VerifiedBadgeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} fill={backgroundColor} />
    <Path
      d="M8 12.2L10.8 15L16 9.5"
      stroke={checkColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
