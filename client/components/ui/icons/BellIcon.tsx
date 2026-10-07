import { Circle, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BellIconProps = {
  size?: number;
  color?: string;
  accentColor?: string;
};

/**
 * Soft filled bell with a small alert dot for notification onboarding hero.
 */
export const BellIcon = ({
  size = 28,
  color = semanticColors.foreground,
  accentColor = semanticColors.report.bleeding,
}: BellIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.2c-3.1 0-5.6 2.4-5.6 5.4v2.1c0 .7-.2 1.4-.6 2L4.6 14.4c-.5.7 0 1.7.9 1.7h12.9c.9 0 1.4-1 .9-1.7l-1.2-1.7c-.4-.6-.6-1.3-.6-2V8.6c0-3-2.5-5.4-5.5-5.4Z"
      fill={color}
      opacity={0.14}
    />
    <Path
      d="M12 3.2c-3.1 0-5.6 2.4-5.6 5.4v2.1c0 .7-.2 1.4-.6 2L4.6 14.4c-.5.7 0 1.7.9 1.7h12.9c.9 0 1.4-1 .9-1.7l-1.2-1.7c-.4-.6-.6-1.3-.6-2V8.6c0-3-2.5-5.4-5.5-5.4Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.6 16.2a2.5 2.5 0 0 0 4.8 0"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="17.2" cy="5.2" r="2.1" fill={accentColor} />
    <Circle cx="17.2" cy="5.2" r="2.1" stroke={semanticColors.card} strokeWidth={1.4} />
  </Svg>
);
