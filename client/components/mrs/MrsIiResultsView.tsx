import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardListRow } from '@/components/dashboard/DashboardListRow';
import { Box } from '@/components/ui/Box';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  MRS_II_PSYCHOLOGICAL_MAX,
  MRS_II_SOMATIC_MAX,
  MRS_II_TOTAL_MAX,
  MRS_II_TOTAL_SEVERITY_LABEL_KEYS,
  MRS_II_UROGENITAL_MAX,
  classifyMrsIiTotalSeverity,
} from '@/lib/mrs/mrsIiTotalSeverity';
import { semanticColors } from '@/lib/ui';

export type MrsIiResultsViewProps = {
  submission: MrsIiAssessmentSubmission;
  onClose: () => void;
  onAddEntry: () => void;
  onAddDoctorQuestion: () => void;
  onEnterAppointment: () => void;
};

type DomainRow = {
  id: string;
  labelKey: string;
  score: number;
  max: number;
};

export const MrsIiResultsView = ({
  submission,
  onClose,
  onAddEntry,
  onAddDoctorQuestion,
  onEnterAppointment,
}: MrsIiResultsViewProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const severity = classifyMrsIiTotalSeverity(submission.total);
  const domainRows: DomainRow[] = [
    {
      id: 'somatic',
      labelKey: 'mrs_ii_results_domain_somatic',
      score: submission.subscores.somatic,
      max: MRS_II_SOMATIC_MAX,
    },
    {
      id: 'psychological',
      labelKey: 'mrs_ii_results_domain_psychological',
      score: submission.subscores.psychological,
      max: MRS_II_PSYCHOLOGICAL_MAX,
    },
    {
      id: 'urogenital',
      labelKey: 'mrs_ii_results_domain_urogenital',
      score: submission.subscores.urogenital,
      max: MRS_II_UROGENITAL_MAX,
    },
  ];

  return (
    <Box flex={1} fullWidth background="background">
      <Box
        direction="row"
        align="center"
        justify="end"
        paddingX="lg"
        style={{ paddingTop: safeAreaTop + 8 }}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('mrs_ii_results_close_accessibility_label')}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={onClose}
          className="h-11 w-11 items-center justify-center">
          <CloseIcon size={22} color={semanticColors.foreground} />
        </TouchableOpacity>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: safeAreaBottom + 32,
          gap: 20,
        }}>
        <Box gap="sm">
          <Text size="2xl" weight="bold" family="serif" className="leading-tight">
            {t('mrs_ii_results_title')}
          </Text>
          <Text size="3xl" weight="bold" family="serif" className="leading-tight">
            {t('mrs_ii_results_score_value', {
              score: submission.total,
              max: MRS_II_TOTAL_MAX,
            })}
          </Text>
          <Text size="sm" color="foreground-muted" className="leading-relaxed">
            {t('mrs_ii_results_interpretation', {
              severity: t(MRS_II_TOTAL_SEVERITY_LABEL_KEYS[severity]),
            })}
          </Text>
        </Box>

        <Box gap="sm">
          <Text size="base" weight="bold" family="serif" className="leading-tight">
            {t('mrs_ii_results_domains_heading')}
          </Text>

          <Box className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-1">
            {domainRows.map((row, index) => (
              <Box key={row.id}>
                <Box direction="row" align="center" justify="between" className="py-3.5">
                  <Text size="sm" className="leading-snug">
                    {t(row.labelKey)}
                  </Text>
                  <Text size="sm" weight="medium" tabularNums className="leading-snug">
                    {t('mrs_ii_results_domain_score', {
                      score: row.score,
                      max: row.max,
                    })}
                  </Text>
                </Box>
                {index < domainRows.length - 1 ? (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: semanticColors.report.hairline,
                    }}
                  />
                ) : null}
              </Box>
            ))}
          </Box>

          <Text size="sm" color="foreground-muted" className="leading-relaxed">
            {t('mrs_ii_results_domains_note')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('mrs_ii_results_classification_note')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('mrs_ii_results_source')}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {t('mrs_ii_results_find_again')}
          </Text>
        </Box>

        <Box className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-4" gap="xs">
          <Text size="xs" weight="semibold" color="foreground-muted" className="uppercase tracking-wide">
            {t('mrs_ii_results_notice_label')}
          </Text>
          <Text size="sm" className="leading-relaxed">
            {t('mrs_ii_results_notice_body')}
          </Text>
        </Box>

        <Box className="overflow-hidden rounded-2xl border border-border bg-card px-5 pb-1 pt-1">
          <DashboardListRow
            title={t('mrs_ii_results_action_add_entry')}
            onPress={onAddEntry}
          />
          <DashboardListRow
            title={t('mrs_ii_results_action_doctor_question')}
            onPress={onAddDoctorQuestion}
          />
          <DashboardListRow
            title={t('mrs_ii_results_action_appointment')}
            onPress={onEnterAppointment}
            showDivider={false}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};
