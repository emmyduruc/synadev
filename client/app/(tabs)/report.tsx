import { useState } from 'react';
import { ScrollView } from 'react-native';

import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { DoctorReportContent } from '@/components/report/DoctorReportContent';
import { ReportTabBar, type ReportTabOption } from '@/components/report/ReportTabBar';
import { UserReportContent } from '@/components/report/UserReportContent';
import { AppHeader, Box, Text } from '@/components/ui';
import { useDoctorReport } from '@/hooks/useDoctorReport';
import { useTranslate } from '@/hooks/useTranslate';
import { useUserReport } from '@/hooks/useUserReport';
import { REPORT_TAB, type ReportTabId } from '@/lib/report/reportConstants';

const ReportTabScreen = () => {
  const { t } = useTranslate();
  const [activeTabId, setActiveTabId] = useState<ReportTabId>(REPORT_TAB.forYou);
  const { isLoading: isUserLoading, report: userReport } = useUserReport();
  const { isLoading: isDoctorLoading, report: doctorReport } = useDoctorReport();

  const tabs: readonly ReportTabOption[] = [
    { id: REPORT_TAB.forYou, label: t('report_tab_for_you') },
    { id: REPORT_TAB.forDoctor, label: t('report_tab_for_doctor') },
  ];

  const isForYou = activeTabId === REPORT_TAB.forYou;

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_report_title')} showBack={false} />

          <Box paddingX="md" paddingY="sm">
            <ReportTabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={setActiveTabId}
            />
          </Box>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <Box paddingX="md" className="pt-2">
              {isForYou ? (
                <Box>
                  {isUserLoading || !userReport ? (
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
                  {isDoctorLoading || !doctorReport ? (
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
    </SynaGradientBackground>
  );
};

export default ReportTabScreen;
