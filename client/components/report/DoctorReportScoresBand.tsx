import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { DoctorReportScoreRow } from '@/lib/report/doctorReportTypes';

export type DoctorReportScoresBandProps = {
  scores: readonly DoctorReportScoreRow[];
};

export const DoctorReportScoresBand = ({ scores }: DoctorReportScoresBandProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md">
      <Text size="2xs" weight="semibold" className="tracking-widest text-black/70">
        {t('doctor_report_scores_title')}
      </Text>
      <Box direction="row" className="flex-wrap gap-2">
        {scores.map((score) => (
          <Box
            key={score.id}
            className="min-w-[30%] flex-1 rounded-xl border border-border bg-card px-3 py-3">
            <Text size="2xs" className="text-black/60">
              {t(score.labelKey)}
            </Text>
            <Text size="lg" weight="bold" className="text-black">
              {score.value}
            </Text>
            {score.detailKey ? (
              <Text size="2xs" className="mt-1 leading-snug text-black/70">
                {t(score.detailKey, score.detailParams)}
              </Text>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
