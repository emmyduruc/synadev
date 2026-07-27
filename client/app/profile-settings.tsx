import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileSettingsContent } from '@/components/profile/ProfileSettingsContent';
import { AppHeader, Box } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';

/**
 * Profile settings modal — section cards for menopause, body, heart risk, lifestyle, and personal.
 * Route is `/profile-settings` (not `/profile/...`) to avoid clashing with the Profile tab.
 */
const ProfileSettingsScreen = () => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SynaGradientBackground>
      <Box flex={1} style={{ paddingTop: safeAreaTop }}>
        <AppHeader title={t('profile_settings_page_title')} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: safeAreaBottom + 24 }}>
          <Box paddingX="md" paddingY="md">
            <ProfileSettingsContent />
          </Box>
        </ScrollView>
      </Box>
    </SynaGradientBackground>
  );
};

export default ProfileSettingsScreen;
