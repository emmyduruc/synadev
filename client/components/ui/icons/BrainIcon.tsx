import { Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type BrainIconProps = {
  size?: number;
  color?: string;
};

/** Two-lobe brain outline for cognition symptoms. */
export const BrainIcon = ({
  size = 24,
  color = semanticColors.splashBackground,
}: BrainIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.5 4.5C9.2 4.5 8.2 5.3 7.8 6.4C6.6 6.7 5.7 7.7 5.7 9C5.7 9.6 5.9 10.1 6.2 10.5C5.5 11 5.2 11.8 5.2 12.7C5.2 14.1 6.1 15.2 7.3 15.6V18.2C7.3 19.3 8.2 20.2 9.3 20.2H10.5V4.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.5 4.5C14.8 4.5 15.8 5.3 16.2 6.4C17.4 6.7 18.3 7.7 18.3 9C18.3 9.6 18.1 10.1 17.8 10.5C18.5 11 18.8 11.8 18.8 12.7C18.8 14.1 17.9 15.2 16.7 15.6V18.2C16.7 19.3 15.8 20.2 14.7 20.2H13.5V4.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 4.5V20.2"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
