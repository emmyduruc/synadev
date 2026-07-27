import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileHealthSourcesCard } from '@/components/profile/ProfileHealthSourcesCard';
import { AppHeader, Box } from '@/components/ui';
import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { useTranslate } from '@/hooks/useTranslate';

/**
 * Data sources modal — Apple Health / Health Connect connect UI.
 * Route is `/profile-data-sources` (not `/profile/...`) to avoid clashing with the Profile tab.
 */
const ProfileDataSourcesScreen = () => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const {
    summary,
    isConnecting,
    errorMessage,
    isConnected,
    connectHealth,
  } = useProfileHealthConnection();

  return (
    <SynaGradientBackground>
      <Box flex={1} style={{ paddingTop: safeAreaTop }}>
        <AppHeader title={t('profile_data_sources_page_title')} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: safeAreaBottom + 24 }}>
          <Box paddingX="md" paddingY="md" gap="md">
            <ProfileHealthSourcesCard
              isConnected={isConnected}
              connectedMetricKeys={summary?.connectedMetricKeys ?? []}
              isConnecting={isConnecting}
              errorMessage={errorMessage}
              onConnect={connectHealth}
            />
          </Box>
        </ScrollView>
      </Box>
    </SynaGradientBackground>
  );
};

export default ProfileDataSourcesScreen;
