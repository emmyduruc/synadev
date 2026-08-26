import { useState } from 'react';
import { ScrollView } from 'react-native';

import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { DoctorReportContent } from '@/components/report/DoctorReportContent';
import { ReportDateRangeSheet } from '@/components/report/ReportDateRangeSheet';
import { ReportTabBar, type ReportTabOption } from '@/components/report/ReportTabBar';
import { UserReportContent } from '@/components/report/UserReportContent';
import { AppHeader, Box, Text } from '@/components/ui';
import { CalendarIcon } from '@/components/ui/icons/CalendarIcon';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useDoctorReport } from '@/hooks/useDoctorReport';
import { useReportDateRange } from '@/hooks/useReportDateRange';
import { useTranslate } from '@/hooks/useTranslate';
import { useUserReport } from '@/hooks/useUserReport';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { REPORT_TAB, type ReportTabId } from '@/lib/report/reportConstants';
import { formatReportDateKey } from '@/lib/report/reportDateRange';
import { cn, semanticColors } from '@/lib/ui';

const ReportTabScreen = () => {
  const { t } = useTranslate();
  const [activeTabId, setActiveTabId] = useState<ReportTabId>(REPORT_TAB.forYou);
  const [isRangeSheetOpen, setIsRangeSheetOpen] = useState(false);
  const isForYou = activeTabId === REPORT_TAB.forYou;

  const {
    range,
    bounds,
    isLoading: isRangeLoading,
    isCustom,
    applyRange,
    resetToDefault,
  } = useReportDateRange(!isForYou);

  const { isLoading: isUserLoading, report: userReport } = useUserReport({ range });
  const { isLoading: isDoctorLoading, report: doctorReport } = useDoctorReport({
    range,
  });

  const tabs: readonly ReportTabOption[] = [
    { id: REPORT_TAB.forYou, label: t('report_tab_for_you') },
    { id: REPORT_TAB.forDoctor, label: t('report_tab_for_doctor') },
  ];

  const isContentLoading = isRangeLoading || (isForYou ? isUserLoading : isDoctorLoading);

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_report_title')} showBack={false} />

          <Box
            direction="row"
            align="center"
            gap="sm"
            paddingX="md"
            paddingY="sm">
            <Box className="min-w-0 flex-1">
              <ReportTabBar
                tabs={tabs}
                activeTabId={activeTabId}
                onTabChange={setActiveTabId}
              />
            </Box>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('report_date_range_open_accessibility')}
              onPress={() => setIsRangeSheetOpen(true)}
              className={cn('h-11 w-11', DASHBOARD_ICON_WELL.calendar)}>
              <CalendarIcon size={20} color={semanticColors.foreground} />
            </TouchableOpacity>
          </Box>

          {isCustom ? (
            <Box paddingX="md" className="pb-1">
              <Text size="2xs" className="text-black/60">
                {t('report_date_range_active_label', {
                  from: formatReportDateKey(range.fromDateKey),
                  to: formatReportDateKey(range.toDateKey),
                })}
              </Text>
            </Box>
          ) : null}

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <Box paddingX="md" className="pt-2">
              {isForYou ? (
                <Box>
                  {isContentLoading || !userReport ? (
                    <Box align="center" justify="center" className="min-h-80" padding="lg">
                      <Text size="sm" align="center" className="text-black">
                        {t('user_report_loading')}
                      </Text>
                    </Box>
                  ) : (
                    <UserReportContent report={userReport} />
                  )}
                </Box>
              ) : (
                <Box>
                  {isContentLoading || !doctorReport ? (
                    <Box align="center" justify="center" className="min-h-80" padding="lg">
                      <Text size="sm" align="center" className="text-black">
                        {t('doctor_report_loading')}
                      </Text>
                    </Box>
                  ) : (
                    <DoctorReportContent report={doctorReport} />
                  )}
                </Box>
              )}
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaScreen>

      <ReportDateRangeSheet
        visible={isRangeSheetOpen}
        initialRange={range}
        bounds={bounds}
        onCancel={() => setIsRangeSheetOpen(false)}
        onApply={(next) => {
          applyRange(next);
          setIsRangeSheetOpen(false);
        }}
        onReset={() => {
          resetToDefault();
          setIsRangeSheetOpen(false);
        }}
      />
    </SynaGradientBackground>
  );
};

export default ReportTabScreen;
