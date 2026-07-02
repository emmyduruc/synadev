import { Path, Svg } from 'react-native-svg';

import { AUTH_PROVIDER, type AuthProvider } from '@/lib/auth/constants';
import { semanticColors } from '@/lib/ui';

type SocialProviderIconProps = {
  provider: AuthProvider;
};

export const SocialProviderIcon = ({ provider }: SocialProviderIconProps) => {
  if (provider === AUTH_PROVIDER.apple) {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          fill={semanticColors.socialIcon.apple}
          d="M16.6 13.1c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s1.9.8 3.3.8c1.4 0 2.2-1.2 3-2.5 1-1.4 1.4-2.8 1.4-2.9-.1-.1-2.9-1.2-2.9-4.3ZM14.2 5.9c.7-.8 1.1-1.9 1-3.1-1 .1-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1.1.1 2.1-.5 2.8-1.3Z"
        />
      </Svg>
    );
  }

  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        fill={semanticColors.socialIcon.googleBlue}
        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 3-4.1 3-7Z"
      />
      <Path
        fill={semanticColors.socialIcon.googleGreen}
        d="M12 22c2.7 0 5-.9 6.6-2.5l-3.1-2.4c-.9.6-2 .9-3.5.9-2.6 0-4.8-1.8-5.6-4.1H3.2v2.5C4.8 19.7 8.1 22 12 22Z"
      />
      <Path
        fill={semanticColors.socialIcon.googleYellow}
        d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.2C2.4 8.9 2 10.4 2 12s.4 3.1 1.2 4.4l3.2-2.5Z"
      />
      <Path
        fill={semanticColors.socialIcon.googleRed}
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3 14.7 2 12 2 8.1 2 4.8 4.3 3.2 7.6l3.2 2.5C7.2 7.8 9.4 6 12 6Z"
      />
    </Svg>
  );
};
