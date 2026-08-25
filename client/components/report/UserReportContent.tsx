import type { ReactElement } from 'react';

import { UserReportBrandHeader } from '@/components/report/UserReportBrandHeader';
import { UserReportChain } from '@/components/report/UserReportChain';
import { UserReportFactsBand } from '@/components/report/UserReportFactsBand';
import { UserReportHero } from '@/components/report/UserReportHero';
import { UserReportInsights } from '@/components/report/UserReportInsights';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { UserReportViewModel } from '@/lib/report/userReportTypes';

export type UserReportContentProps = {
  report: UserReportViewModel;
};

export const UserReportContent = ({
  report,
}: UserReportContentProps): ReactElement => {
  const { t } = useTranslate();

  return (
    <Box gap="xl" className="pb-8">
      <UserReportBrandHeader
        firstName={report.firstName}
        trackedDays={report.trackedDays}
      />

      <UserReportHero
        headlineKey={report.headlineKey}
        introKey={report.introKey}
      />

      {report.chainSteps.length > 0 ? (
        <UserReportChain steps={report.chainSteps} />
      ) : null}

      <UserReportFactsBand
        titleKey={report.factsTitleKey}
        days={report.trackedDays > 0 ? report.trackedDays : report.windowDays}
        pills={report.factPills}
      />

      <UserReportInsights blocks={report.insights} />

      <Box className="border-t border-border pt-4">
        <Text size="2xs" className="leading-relaxed text-black/70">
          {t('user_report_disclaimer')}
        </Text>
      </Box>
    </Box>
  );
};
