import { Circle, Ellipse, Path, Svg } from 'react-native-svg';

import { semanticColors } from '@/lib/ui';

export type MascotBearIconProps = {
  size?: number;
};

/**
 * SYNA teddy mascot — soft, feminine palette (dusty rose + apricot blush).
 */
export const MascotBearIcon = ({ size = 120 }: MascotBearIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <Circle cx="28" cy="30" r="16" fill={semanticColors.ovum.dustyRose} />
    <Circle cx="92" cy="30" r="16" fill={semanticColors.ovum.dustyRose} />
    <Circle cx="28" cy="30" r="10" fill={semanticColors.ovum.dustyRoseLight} />
    <Circle cx="92" cy="30" r="10" fill={semanticColors.ovum.dustyRoseLight} />
    <Circle cx="60" cy="58" r="34" fill={semanticColors.ovum.dustyRose} />
    <Circle cx="60" cy="62" r="28" fill={semanticColors.ovum.apricotLight} />
    <Ellipse cx="60" cy="72" rx="16" ry="12" fill={semanticColors.card} />
    <Circle cx="48" cy="56" r="4" fill={semanticColors.foreground} />
    <Circle cx="72" cy="56" r="4" fill={semanticColors.foreground} />
    <Circle cx="49" cy="55" r="1.5" fill={semanticColors.card} />
    <Circle cx="73" cy="55" r="1.5" fill={semanticColors.card} />
    <Ellipse cx="60" cy="66" rx="5" ry="4" fill={semanticColors.splashBackground} />
    <Path
      d="M54 74C57 77 63 77 66 74"
      stroke={semanticColors.splashBackground}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx="40" cy="68" r="5" fill={semanticColors.ovum.dustyRoseLight} opacity={0.85} />
    <Circle cx="80" cy="68" r="5" fill={semanticColors.ovum.dustyRoseLight} opacity={0.85} />
    <Ellipse cx="60" cy="98" rx="22" ry="18" fill={semanticColors.ovum.dustyRose} />
    <Ellipse cx="60" cy="100" rx="16" ry="13" fill={semanticColors.ovum.apricotLight} />
    <Circle cx="38" cy="94" r="9" fill={semanticColors.ovum.dustyRose} />
    <Circle cx="82" cy="94" r="9" fill={semanticColors.ovum.dustyRose} />
  </Svg>
);
