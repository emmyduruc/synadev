import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MailIconProps = {
  size?: number;
  color?: string;
};

export const MailIcon = ({
  size = 18,
  color = semanticColors.foreground,
}: MailIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 7.5L12 13l8.5-5.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
