import type { ReportDoctorQuestionId } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

// import { DashboardCheckInCard } from '@/components/dashboard/DashboardCheckInCard';
import { DashboardAppointmentCard } from '@/components/dashboard/DashboardAppointmentCard';
import { DashboardAppointmentEditSheet } from '@/components/dashboard/DashboardAppointmentEditSheet';
import { DashboardCyclePhaseCard } from '@/components/dashboard/DashboardCyclePhaseCard';
import { DashboardDailyLogCard } from '@/components/dashboard/DashboardDailyLogCard';
import { DashboardGreetingSection } from '@/components/dashboard/DashboardGreetingSection';
import { DashboardHealthMetricsRow } from '@/components/dashboard/DashboardHealthMetricsRow';
import { DashboardInsightsSection } from '@/components/dashboard/DashboardInsightsSection';
import { DashboardNextStepsCard } from '@/components/dashboard/DashboardNextStepsCard';
import { DashboardSetupProgress } from '@/components/dashboard/DashboardSetupProgress';
import { DashboardWeekCalendarSection } from '@/components/dashboard/DashboardWeekCalendarSection';
import { useConfettiCelebration } from '@/components/gamification/ConfettiProvider';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { ProfileCompletionBanner } from '@/components/profile/ProfileCompletionBanner';
import { ReportConcernsSheet } from '@/components/report/ReportConcernsSheet';
import { ReportDoctorQuestionsSheet } from '@/components/report/ReportDoctorQuestionsSheet';
import { Box } from '@/components/ui';
import { useBioData } from '@/hooks/useBioData';
import { useCorrectOptimisticHomeDestination } from '@/hooks/useCorrectOptimisticHomeDestination';
import { useCycleCalendarMarkers } from '@/hooks/useCycleCalendarMarkers';
import { useDashboardSetupProgress } from '@/hooks/useDashboardSetupProgress';
import { useOpenBioDataWizard } from '@/hooks/useOpenBioDataWizard';
import { useProfileCompletionBanner } from '@/hooks/useProfileCompletionBanner';
import { useReportPreferences } from '@/hooks/useReportPreferences';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
// import { CALENDAR_MODE } from '@/lib/period/constants';
import type { ReportConcernId } from '@/lib/report/reportConcerns';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/ui';

const StartTabScreen = () => {
  const router = useRouter();
  const [isAppointmentEditVisible, setIsAppointmentEditVisible] = useState(false);
  const [isDoctorQuestionsSheetOpen, setIsDoctorQuestionsSheetOpen] = useState(false);
  const [isConcernsSheetOpen, setIsConcernsSheetOpen] = useState(false);
  const { preferences, savePreferences } = useReportPreferences();
  const selectedDoctorQuestionIds =
    preferences.doctorQuestionIds as ReportDoctorQuestionId[];
  const customDoctorQuestions = preferences.customDoctorQuestions;
  const selectedConcernIds = preferences.concernIds as ReportConcernId[];
  const concernFreeText = preferences.concernFreeText ?? '';
  const {
    bioData,
    percent: bioPercent,
    isComplete: isBioComplete,
    isLoading: isBioLoading,
    hasSyncedFromServer,
    wasCompleteOnHydrate,
    refresh: refreshBio,
  } = useBioData();
  useCorrectOptimisticHomeDestination({
    isComplete: isBioComplete,
    isLoading: isBioLoading,
    hasSyncedFromServer,
    wasCompleteOnHydrate,
  });
  const openBioDataWizard = useOpenBioDataWizard();
  const {
    percent,
    isVisible: isProfileBannerVisible,
    isLoading: isProfileBannerLoading,
    dismiss: dismissProfileBanner,
  } = useProfileCompletionBanner({
    percent: bioPercent,
    isComplete: isBioComplete,
    isLoading: isBioLoading,
    refresh: refreshBio,
  });
  const { celebrate } = useConfettiCelebration();
  const {
    snapshot: cycleSnapshot,
    isLoading: isCycleLoading,
    getPrimaryMarker,
  } = useCycleCalendarMarkers();
  const {
    metrics,
    isConnected,
    isConnecting,
    healthIssue,
    canInstallHealthConnect,
    connectHealth,
    openHealthConnectHelp,
    steps,
    completedCount,
    totalCount,
    currentStepId,
    isFullyComplete,
    isSetupLoading,
  } = useDashboardSetupProgress();

  const handleConnectHealth = async () => {
    const connected = await connectHealth();

    if (connected) {
      celebrate(CONFETTI_ACTION.healthConnected);
    }
  };

  const showProfileBanner = !isProfileBannerLoading && isProfileBannerVisible;
  const showSetupProgress = !isSetupLoading && !isFullyComplete;

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}>
            <Box padding="lg" gap="lg">
              <DashboardGreetingSection
                firstName={bioData.firstName}
                lastName={bioData.lastName}
              />

              <Box className={cn(DASHBOARD_SURFACE.lavenderShell, 'p-4')}>
                <DashboardWeekCalendarSection
                  embedded
                  getPrimaryMarker={getPrimaryMarker}
                  onOpenCalendar={() => router.push(ROUTES.calendar)}
                />
              </Box>

              {showSetupProgress ? (
                <DashboardSetupProgress
                  steps={steps}
                  completedCount={completedCount}
                  totalCount={totalCount}
                  currentStepId={currentStepId}
                  isConnectingHealth={isConnecting}
                  healthIssue={healthIssue}
                  canInstallHealthConnect={canInstallHealthConnect}
                  onConnectHealth={() => {
                    void handleConnectHealth();
                  }}
                  onInstallHealthConnect={() => {
                    void openHealthConnectHelp();
                  }}
                  onStartMrsIi={() => {
                    router.push(ROUTES.assessment.mrsIi);
                  }}
                  onStartPam13={() => {
                    router.push(ROUTES.assessment.patientActivationMeasure);
                  }}
                />
              ) : null}

              <DashboardHealthMetricsRow metrics={metrics} isConnected={isConnected} />

              <DashboardDailyLogCard onPress={() => router.push(ROUTES.symptoms)} />

              {/*
              Temporary: check-in quick actions (record/edit period, mood, symptoms) hidden.
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
              */}

              <DashboardCyclePhaseCard
                snapshot={cycleSnapshot}
                isLoading={isCycleLoading}
              />
              <DashboardAppointmentCard
                onPressChange={() => setIsAppointmentEditVisible(true)}
                onPressAddQuestions={() => setIsDoctorQuestionsSheetOpen(true)}
                onPressAddConcerns={() => setIsConcernsSheetOpen(true)}
                onPressGoToReport={() => router.push(ROUTES.tabs.report)}
              />
              <DashboardNextStepsCard
                onPressFirstEntry={() => router.push(ROUTES.symptoms)}
              />
              <DashboardInsightsSection />
            </Box>
          </ScrollView>

          <DashboardAppointmentEditSheet
            visible={isAppointmentEditVisible}
            onClose={() => setIsAppointmentEditVisible(false)}
          />

          <ReportDoctorQuestionsSheet
            visible={isDoctorQuestionsSheetOpen}
            selectedQuestionIds={selectedDoctorQuestionIds}
            customQuestions={customDoctorQuestions}
            onClose={() => setIsDoctorQuestionsSheetOpen(false)}
            onApply={(selection) => {
              void savePreferences({
                ...preferences,
                doctorQuestionIds: [...selection.questionIds],
                customDoctorQuestions: [...selection.customQuestions],
              });
              setIsDoctorQuestionsSheetOpen(false);
            }}
          />

          <ReportConcernsSheet
            visible={isConcernsSheetOpen}
            selectedConcernIds={selectedConcernIds}
            freeText={concernFreeText}
            onClose={() => setIsConcernsSheetOpen(false)}
            onApply={(selection) => {
              void savePreferences({
                ...preferences,
                concernIds: [...selection.concernIds],
                concernFreeText: selection.freeText.trim() || null,
              });
              setIsConcernsSheetOpen(false);
            }}
          />

          {showProfileBanner ? (
            <Box
              className="absolute left-4 right-4 top-2 z-10"
              pointerEvents="box-none">
              <ProfileCompletionBanner
                percent={percent}
                onPress={openBioDataWizard}
                onDismiss={() => {
                  void dismissProfileBanner();
                }}
              />
            </Box>
          ) : null}
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default StartTabScreen;
