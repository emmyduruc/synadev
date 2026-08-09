import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CycleInsightsContent } from '@/components/cycle/CycleInsightsContent';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { AppHeader, Box } from '@/components/ui';
import { useCycleCalendarMarkers } from '@/hooks/useCycleCalendarMarkers';
import { useTranslate } from '@/hooks/useTranslate';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import { ROUTES } from '@/lib/routes';

/**
 * Cycle Insights — phase hero, week markers, tips.
 * Opened from the dashboard cycle phase card (not record-period).
 */
const CycleInsightsScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { top: safeAreaTop } = useSafeAreaInsets();
  const { snapshot, markersByDate, isLoading } = useCycleCalendarMarkers();

  return (
    <SynaGradientBackground>
      <Box flex={1} style={{ paddingTop: safeAreaTop }}>
        <AppHeader title={t('cycle_insights_title')} />
        <MascotLoadingGate
          isReady={!isLoading}
          variant={LOADING_VARIANT.cycleCalendar}
          className="flex-1">
          <CycleInsightsContent
            snapshot={snapshot}
            markersByDate={markersByDate}
            onLogPeriod={() => {
              router.push(ROUTES.recordPeriod);
            }}
            onOpenCalendar={() => {
              router.push(ROUTES.calendar);
            }}
            onLogSymptoms={() => {
              router.push(ROUTES.symptoms);
            }}
            onPeriodEnded={() => {
              router.push(ROUTES.periodEnded);
            }}
          />
        </MascotLoadingGate>
      </Box>
    </SynaGradientBackground>
  );
};

export default CycleInsightsScreen;
