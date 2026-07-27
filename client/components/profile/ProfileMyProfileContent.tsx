import { useRouter } from 'expo-router';

import { ProfileMissingPatternsCard } from '@/components/profile/ProfileMissingPatternsCard';
import { ProfileNavRow } from '@/components/profile/ProfileNavRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useBioData } from '@/hooks/useBioData';
import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';

export const ProfileMyProfileContent = () => {
  const { t } = useTranslate();
  const router = useRouter();
  const { bioData } = useBioData();
  const { isConnected } = useProfileHealthConnection();

  const displayName = [bioData.firstName, bioData.lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');

  const dataSourcesSubtitle = isConnected
    ? t('profile_data_sources_nav_connected')
    : t('profile_data_sources_nav_disconnected');

  return (
    <Box gap="md">
      <ProfileMissingPatternsCard />

      <ProfileNavRow
        title={t('profile_settings_nav_title')}
        subtitle={t('profile_settings_nav_subtitle')}
        icon={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
        onPress={() => {
          router.push(ROUTES.profile.settings);
        }}
      />

      <ProfileNavRow
        title={t('profile_health_sources_title')}
        subtitle={dataSourcesSubtitle}
        icon={{ ios: 'heart.text.square.fill', android: 'monitor_heart', web: 'monitor_heart' }}
        onPress={() => {
          router.push(ROUTES.profile.dataSources);
        }}
      />

      {displayName.length > 0 ? (
        <Text size="xs" color="foreground-muted" className="px-1">
          {t('profile_my_profile_summary', { name: displayName })}
        </Text>
      ) : null}
    </Box>
  );
};
