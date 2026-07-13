import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCheckInCard } from '@/components/dashboard/DashboardCheckInCard';
import { DashboardConnectHealthSection } from '@/components/dashboard/DashboardConnectHealthSection';
import { DashboardCyclePhaseCard } from '@/components/dashboard/DashboardCyclePhaseCard';
import { DashboardGreetingSection } from '@/components/dashboard/DashboardGreetingSection';
import { DashboardHealthMetricsRow } from '@/components/dashboard/DashboardHealthMetricsRow';
import { DashboardInsightsSection } from '@/components/dashboard/DashboardInsightsSection';
import { DashboardWeekCalendarSection } from '@/components/dashboard/DashboardWeekCalendarSection';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileCompletionBanner } from '@/components/profile/ProfileCompletionBanner';
import { AppHeader, Box } from '@/components/ui';
import { useBioData } from '@/hooks/useBioData';
import { useDashboardHealth } from '@/hooks/useDashboardHealth';
import { useOpenBioDataWizard } from '@/hooks/useOpenBioDataWizard';
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
  const { percent, isVisible, isLoading, dismiss } = useProfileCompletionBanner();
  const { celebrate } = useConfettiCelebration();
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

  return (
    <SynaGradientBackground>
      <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
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
              <DashboardInsightsSection />
              <DashboardCyclePhaseCard />
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

export default StartTabScreen;
