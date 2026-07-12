import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileCompletionBanner } from '@/components/profile/ProfileCompletionBanner';
import { ProfileMyProfileContent } from '@/components/profile/ProfileMyProfileContent';
import { ProfileTabBar, type ProfileTabOption } from '@/components/profile/ProfileTabBar';
import { ProfileTabPlaceholder } from '@/components/profile/ProfileTabPlaceholder';
import { AppHeader, Box } from '@/components/ui';
import { useOpenBioDataWizard } from '@/hooks/useOpenBioDataWizard';
import { useProfileCompletionBanner } from '@/hooks/useProfileCompletionBanner';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_TAB, type ProfileTabId } from '@/lib/profile/constants';

const ProfileTabScreen = () => {
  const { t } = useTranslate();
  const [activeTabId, setActiveTabId] = useState<ProfileTabId>(PROFILE_TAB.myProfile);
  const { percent, isVisible, isLoading, dismiss } = useProfileCompletionBanner();
  const openBioDataWizard = useOpenBioDataWizard();

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

          {!isLoading && isVisible ? (
            <Box className="absolute left-4 right-4 top-2 z-10" pointerEvents="box-none">
              <ProfileCompletionBanner
                percent={percent}
                onPress={openBioDataWizard}
                onDismiss={() => {
                  void dismiss();
                }}
              />
            </Box>
          ) : null}
        </Box>
      </SafeAreaView>
    </SynaGradientBackground>
  );
};

export default ProfileTabScreen;
