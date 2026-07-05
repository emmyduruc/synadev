import { SymbolView } from 'expo-symbols';
import { Platform } from 'react-native';

import { PLATFORM_OS, semanticColors } from '@/lib/ui';

export const ProfilePlatformHealthIcon = () => {
  if (Platform.OS === PLATFORM_OS.android) {
    return (
      <SymbolView
        name={{ ios: 'waveform.path.ecg', android: 'monitor_heart', web: 'monitor_heart' }}
        size={20}
        tintColor={semanticColors.splashBackground}
      />
    );
  }

  return (
    <SymbolView
      name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
      size={20}
      tintColor={semanticColors.splashBackground}
    />
  );
};
