import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type FollicularPhaseIconProps = {
  size?: number;
  color?: string;
};

/** Energy flash for follicular phase (rising estrogen / vitality). */
export const FollicularPhaseIcon = ({
  size = 24,
  color = semanticColors.dashboardIcon.follicular,
}: FollicularPhaseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13.5 2.5L6.5 13H11.5L10.5 21.5L17.5 11H12.5L13.5 2.5Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
