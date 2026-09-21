import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type EyeIconProps = {
  size?: number;
  color?: string;
  /** When true, shows the "hidden" (slashed) eye variant. */
  crossed?: boolean;
};

export const EyeIcon = ({
  size = 20,
  color = semanticColors.foregroundMuted,
  crossed = false,
}: EyeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      stroke={color}
      strokeWidth={1.8}
    />
    {crossed ? (
      <Path
        d="M4 4l16 16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    ) : null}
  </Svg>
);
