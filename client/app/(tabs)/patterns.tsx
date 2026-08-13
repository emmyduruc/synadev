import { useFocusEffect, useNavigation } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BackHandler, Platform } from 'react-native';

import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { PatternsBody } from '@/components/patterns/PatternsBody';
import { AppHeader, Box, Text } from '@/components/ui';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { usePatternsDashboard } from '@/hooks/usePatternsDashboard';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import { exportPatternsPdf } from '@/lib/patterns/exportPatternsPdf';
import { cn } from '@/lib/ui';

const TAB_BAR_DISPLAY = {
  none: 'none',
} as const;

const lockPortrait = async () => {
  if (Platform.OS === 'android') {
    await ScreenOrientation.unlockAsync();
  }

  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
};

const PatternsTabScreen = () => {
  const { t } = useTranslate();
  const navigation = useNavigation();
  const { isLoading, computation, chartSeries, chartWindow, mrsLatest, pamLatest } =
    usePatternsDashboard();
  const [isGraphMode, setIsGraphMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isGraphModeRef = useRef(isGraphMode);
  isGraphModeRef.current = isGraphMode;

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: isGraphMode ? { display: TAB_BAR_DISPLAY.none } : undefined,
    });
  }, [isGraphMode, navigation]);

  const exitGraphMode = useCallback(() => {
    setIsGraphMode(false);
  }, []);

  useEffect(() => {
    const applyOrientation = async () => {
      if (isGraphMode) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
        return;
      }

      await lockPortrait();
    };

    void applyOrientation();
  }, [isGraphMode]);

  // Tab screens stay mounted — restore portrait only when this screen loses focus.
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!isGraphModeRef.current) {
          return false;
        }

        setIsGraphMode(false);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
        setIsGraphMode(false);
        void lockPortrait();
      };
    }, []),
  );

  const handleExport = useCallback(async () => {
    if (!computation || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      await exportPatternsPdf({
        computation,
        mrsLatest,
        pamLatest,
        t,
      });
    } finally {
      setIsExporting(false);
    }
  }, [computation, isExporting, mrsLatest, pamLatest, t]);

  return (
    <SynaGradientBackground>
      <SafeAreaScreen
        edges={isGraphMode ? SAFE_AREA_EDGES.none : SAFE_AREA_EDGES.top}
        style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          {isGraphMode ? null : (
            <AppHeader
              title={t('tab_patterns_title')}
              showBack={false}
              right={
                <Box direction="row" align="center" gap="xs">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('patterns_toggle_graph_accessibility')}
                    onPress={() => {
                      setIsGraphMode(true);
                    }}
                    className={cn('h-10 px-2.5', DASHBOARD_ICON_WELL.gem)}>
                    <Text size="2xs" weight="semibold" color="primary">
                      {t('patterns_mode_graph')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('patterns_export_pdf_accessibility')}
                    disabled={!computation || isExporting}
                    onPress={() => {
                      void handleExport();
                    }}
                    className={cn(
                      'h-10 px-2.5',
                      DASHBOARD_ICON_WELL.gem,
                      (!computation || isExporting) && 'opacity-40',
                    )}>
                    <Text size="2xs" weight="semibold" color="primary">
                      {t('patterns_export_pdf')}
                    </Text>
                  </TouchableOpacity>
                </Box>
              }
            />
          )}

          <MascotLoadingGate
            isReady={!isLoading}
            variant={LOADING_VARIANT.generic}
            className="flex-1">
            <PatternsBody
              computation={computation}
              chartSeries={chartSeries}
              chartWindow={chartWindow}
              isGraphMode={isGraphMode}
              mrsLatest={mrsLatest}
              pamLatest={pamLatest}
              onExitGraphMode={exitGraphMode}
              onExportPdf={() => {
                void handleExport();
              }}
              isExporting={isExporting}
            />
          </MascotLoadingGate>
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default PatternsTabScreen;
