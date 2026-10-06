import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export const ReportMechanismCard = () => {
  const { t } = useTranslate();

  return (
    <Box className="rounded-2xl border border-border bg-card px-4 py-4" gap="md">
      <Text size="base" weight="bold" className="leading-tight">
        {t('report_mechanism_heading')}
      </Text>

      <Box gap="md">
        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('report_mechanism_body_placeholder')}
        </Text>

        <Text size="sm" weight="bold" color="foreground" className="leading-tight">
          {t('report_mechanism_other_causes_heading')}
        </Text>

        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('report_mechanism_other_causes_placeholder')}
        </Text>

        <Text size="sm" color="foreground-muted" className="leading-relaxed">
          {t('report_mechanism_disclaimer')}
        </Text>
      </Box>

      <View
        style={{
          height: 1,
          backgroundColor: semanticColors.report.hairline,
        }}
      />

      <Box direction="row" align="center" gap="md">
        <View
          className="h-11 w-11 rounded-full"
          style={{ backgroundColor: semanticColors.report.dataBackground }}
        />
        <Box flex={1} gap="xs">
          <Text size="sm" weight="bold" color="foreground" className="leading-tight">
            {t('report_mechanism_verified_by')}
          </Text>
          <Text size="sm" color="foreground-muted" className="leading-relaxed">
            {t('report_mechanism_reviewer_placeholder')}
          </Text>
        </Box>
      </Box>

      <Text size="2xs" color="foreground-subtle" className="leading-relaxed">
        {t('report_mechanism_source_placeholder')}
      </Text>
    </Box>
  );
};
