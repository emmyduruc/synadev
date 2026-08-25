import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DoctorReportHeroProps = {
  summaryKey: string;
  summaryParams: Record<string, string | number>;
};

export const DoctorReportHero = ({
  summaryKey,
  summaryParams,
}: DoctorReportHeroProps) => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-2xl bg-card px-4 py-5">
      <Text size="2xs" weight="semibold" className="mb-2 tracking-widest text-black/70">
        {t('doctor_report_summary_eyebrow')}
      </Text>
      <Text size="sm" className="leading-relaxed text-black">
        {t(summaryKey, summaryParams)}
      </Text>
    </Box>
  );
};
