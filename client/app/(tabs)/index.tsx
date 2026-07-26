import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { DashboardCheckInCard } from '@/components/dashboard/DashboardCheckInCard';
import { DashboardConnectHealthSection } from '@/components/dashboard/DashboardConnectHealthSection';
import { DashboardCyclePhaseCard } from '@/components/dashboard/DashboardCyclePhaseCard';
import { DashboardGreetingSection } from '@/components/dashboard/DashboardGreetingSection';
import { DashboardHealthMetricsRow } from '@/components/dashboard/DashboardHealthMetricsRow';
import { DashboardInsightsSection } from '@/components/dashboard/DashboardInsightsSection';
import { DashboardWeekCalendarSection } from '@/components/dashboard/DashboardWeekCalendarSection';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { MenopauseScaleBanner } from '@/components/mrs/MenopauseScaleBanner';
import { PatientActivationMeasureBanner } from '@/components/patientActivationMeasure/PatientActivationMeasureBanner';
import { ProfileCompletionBanner } from '@/components/profile/ProfileCompletionBanner';
import { AppHeader, Box } from '@/components/ui';
import { useBioData } from '@/hooks/useBioData';
import { useCyclePhase } from '@/hooks/useCyclePhase';
import { useDashboardHealth } from '@/hooks/useDashboardHealth';
import { useMenopauseScaleBanner } from '@/hooks/useMenopauseScaleBanner';
import { useOpenBioDataWizard } from '@/hooks/useOpenBioDataWizard';
import { usePatientActivationMeasureBanner } from '@/hooks/usePatientActivationMeasureBanner';
import { useProfileCompletionBanner } from '@/hooks/useProfileCompletionBanner';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { CALENDAR_MODE } from '@/lib/period/constants';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/ui';

const StartTabScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { bioData } = useBioData();
  const openBioDataWizard = useOpenBioDataWizard();
  const {
    percent,
    isVisible: isProfileBannerVisible,
    isLoading: isProfileBannerLoading,
    dismiss: dismissProfileBanner,
  } = useProfileCompletionBanner();
  const {
    isVisible: isMrsBannerVisible,
    isLoading: isMrsBannerLoading,
    dismiss: dismissMrsBanner,
  } = useMenopauseScaleBanner();
  const {
    isVisible: isPatientActivationMeasureBannerVisible,
    isLoading: isPatientActivationMeasureBannerLoading,
    dismiss: dismissPatientActivationMeasureBanner,
  } = usePatientActivationMeasureBanner();
  const { celebrate } = useConfettiCelebration();
  const { snapshot: cycleSnapshot, isLoading: isCycleLoading } = useCyclePhase();
  const {
    healthSnapshot,
    metrics,
    isConnecting,
    errorMessage,
    isConnected,
    connectHealth,
  } = useDashboardHealth();

  const handleConnectHealth = async () => {
    const connected = await connectHealth();

    if (connected) {
      celebrate(CONFETTI_ACTION.healthConnected);
    }
  };

  const showProfileBanner = !isProfileBannerLoading && isProfileBannerVisible;
  const showMrsBanner = !isMrsBannerLoading && isMrsBannerVisible;
  const showPatientActivationMeasureBanner =
    !isPatientActivationMeasureBannerLoading &&
    isPatientActivationMeasureBannerVisible;
  const showAnyBanner =
    showProfileBanner || showMrsBanner || showPatientActivationMeasureBanner;

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_start_title')} showBack={false} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}>
            <Box padding="lg" gap="lg">
              <DashboardGreetingSection firstName={bioData.firstName} />
              <DashboardHealthMetricsRow metrics={metrics} isConnected={isConnected} />
              <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'gap-4 p-4')}>
                <DashboardWeekCalendarSection
                  embedded
                  onOpenCalendar={() => router.push(ROUTES.calendar)}
                />
                <DashboardCheckInCard
                  embedded
                  onCelebrate={celebrate}
                  onRecordPeriod={() => router.push(ROUTES.recordPeriod)}
                  onEditPeriod={() =>
                    router.push({
                      pathname: ROUTES.calendar,
                      params: { mode: CALENDAR_MODE.editPeriod },
                    })
                  }
                  onOpenSymptoms={() => router.push(ROUTES.symptoms)}
                  onOpenMood={() => router.push(ROUTES.mood)}
                />
              </Box>
              <DashboardCyclePhaseCard
                snapshot={cycleSnapshot}
                isLoading={isCycleLoading}
              />
              <DashboardInsightsSection />
              <DashboardConnectHealthSection
                healthSnapshot={healthSnapshot}
                errorMessage={errorMessage}
                isConnecting={isConnecting}
                onConnect={() => {
                  void handleConnectHealth();
                }}
              />
            </Box>
          </ScrollView>

          {showAnyBanner ? (
            <Box
              className="absolute left-4 right-4 top-2 z-10 gap-2"
              pointerEvents="box-none">
              {showProfileBanner ? (
                <ProfileCompletionBanner
                  percent={percent}
                  onPress={openBioDataWizard}
                  onDismiss={() => {
                    void dismissProfileBanner();
                  }}
                />
              ) : null}
              {showMrsBanner ? (
                <MenopauseScaleBanner
                  onPress={() => router.push(ROUTES.assessment.mrsIi)}
                  onDismiss={() => {
                    void dismissMrsBanner();
                  }}
                />
              ) : null}
              {showPatientActivationMeasureBanner ? (
                <PatientActivationMeasureBanner
                  onPress={() =>
                    router.push(ROUTES.assessment.patientActivationMeasure)
                  }
                  onDismiss={() => {
                    void dismissPatientActivationMeasureBanner();
                  }}
                />
              ) : null}
            </Box>
          ) : null}
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default StartTabScreen;
