import type { MrsIiAssessmentSubmission, Pam13AssessmentSubmission } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type PatternsClinicalStripProps = {
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
};

export const PatternsClinicalStrip = ({
  mrsLatest,
  pamLatest,
}: PatternsClinicalStripProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" gap="sm">
      <Box flex={1} className={cn(DASHBOARD_SURFACE.nestedLift, 'gap-1 p-3')}>
        <Text size="2xs" weight="semibold" color="foreground-muted">
          {t('patterns_clinical_mrs_label')}
        </Text>
        {mrsLatest ? (
          <>
            <Text size="lg" weight="bold" color="primary">
              {mrsLatest.total}
            </Text>
            <Text size="2xs" color="foreground" className="leading-snug">
              {t('patterns_clinical_mrs_domains', {
                somatic: mrsLatest.subscores.somatic,
                psychological: mrsLatest.subscores.psychological,
                urogenital: mrsLatest.subscores.urogenital,
              })}
            </Text>
          </>
        ) : (
          <Text size="xs" color="foreground-muted">
            {t('patterns_clinical_mrs_empty')}
          </Text>
        )}
      </Box>

      <Box flex={1} className={cn(DASHBOARD_SURFACE.nestedLift, 'gap-1 p-3')}>
        <Text size="2xs" weight="semibold" color="foreground-muted">
          {t('patterns_clinical_pam_label')}
        </Text>
        {pamLatest?.scaledScore !== null && pamLatest?.scaledScore !== undefined ? (
          <Text size="lg" weight="bold" color="primary">
            {Math.round(pamLatest.scaledScore)}
          </Text>
        ) : (
          <Text size="xs" color="foreground-muted">
            {t('patterns_clinical_pam_empty')}
          </Text>
        )}
      </Box>
    </Box>
  );
};
