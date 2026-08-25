import type { PatternHeatmapResult } from '@syna/shared-utils';

import { DoctorReportMiniChart } from '@/components/report/DoctorReportMiniChart';
import { DoctorReportSymptomGrid } from '@/components/report/DoctorReportSymptomGrid';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { DoctorReportSection } from '@/lib/report/doctorReportTypes';

export type DoctorReportSectionCardProps = {
  section: DoctorReportSection;
  heatmap: PatternHeatmapResult | null;
};

export const DoctorReportSectionCard = ({
  section,
  heatmap,
}: DoctorReportSectionCardProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md" className="rounded-2xl border border-border bg-card/90 px-4 py-5">
      <Text size="sm" weight="semibold" className="text-black">
        {t(section.titleKey)}
      </Text>

      {section.paragraphs.map((block) => (
        <Text key={block.id} size="xs" className="leading-relaxed text-black">
          {t(block.bodyKey, block.params)}
        </Text>
      ))}

      {section.charts.length > 0 ? (
        <Box gap="md">
          {section.charts.map((chart) => (
            <DoctorReportMiniChart key={chart.id} chart={chart} />
          ))}
        </Box>
      ) : null}

      {section.showSymptomGrid && heatmap ? (
        <DoctorReportSymptomGrid heatmap={heatmap} />
      ) : null}
    </Box>
  );
};
