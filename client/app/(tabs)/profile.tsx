import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileMyProfileContent } from '@/components/profile/ProfileMyProfileContent';
import { ProfileTabBar, type ProfileTabOption } from '@/components/profile/ProfileTabBar';
import { ProfileTabPlaceholder } from '@/components/profile/ProfileTabPlaceholder';
import { AppHeader, Box } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_TAB, type ProfileTabId } from '@/lib/profile/constants';

const ProfileTabScreen = () => {
  const { t } = useTranslate();
  const [activeTabId, setActiveTabId] = useState<ProfileTabId>(PROFILE_TAB.myProfile);

  const tabs: readonly ProfileTabOption[] = [
    { id: PROFILE_TAB.myProfile, label: t('profile_tab_my_profile') },
    { id: PROFILE_TAB.deepening, label: t('profile_tab_deepening') },
    { id: PROFILE_TAB.healthRecord, label: t('profile_tab_health_record') },
  ];

  const isMyProfileActive = activeTabId === PROFILE_TAB.myProfile;
  const isDeepeningActive = activeTabId === PROFILE_TAB.deepening;
  const isHealthRecordActive = activeTabId === PROFILE_TAB.healthRecord;

  return (
    <SynaGradientBackground>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('profile_page_title')} showBack={false} />
          <Box paddingX="md" paddingY="sm">
            <ProfileTabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={setActiveTabId}
            />
          </Box>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}>
            <Box paddingX="md" gap="md">
              <Box style={isMyProfileActive ? undefined : { display: 'none' }}>
                <ProfileMyProfileContent />
              </Box>

              {isDeepeningActive ? (
                <ProfileTabPlaceholder message={t('profile_tab_deepening_placeholder')} />
              ) : null}

              {isHealthRecordActive ? (
                <ProfileTabPlaceholder message={t('profile_tab_health_record_placeholder')} />
              ) : null}
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaView>
    </SynaGradientBackground>
  );
};

export default ProfileTabScreen;
