import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type JointStiffnessIconProps = {
  size?: number;
  color?: string;
};

/** Mirrored wavy lines for joint stiffness persistent complaint. */
export const JointStiffnessIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: JointStiffnessIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 4C6.5 6.5 6.5 9 8 11.5C9.5 14 9.5 16.5 8 20"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 4C17.5 6.5 17.5 9 16 11.5C14.5 14 14.5 16.5 16 20"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
