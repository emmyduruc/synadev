import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type FollicularPhaseIconProps = {
  size?: number;
  color?: string;
};

export const FollicularPhaseIcon = ({
  size = 24,
  color = semanticColors.ovum.lavender,
}: FollicularPhaseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 14C12 14 8.5 11.5 8.5 8.5C8.5 6.57 10.07 5 12 5C13.93 5 15.5 6.57 15.5 8.5C15.5 11.5 12 14 12 14Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path
      d="M12 14V19M12 19L9.5 16.5M12 19L14.5 16.5"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
