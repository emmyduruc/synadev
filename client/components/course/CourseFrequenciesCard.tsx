import { useState } from 'react';

import { CourseFrequencyInfoSheet } from '@/components/course/CourseFrequencyInfoSheet';
import { CourseFrequencyRowView } from '@/components/course/CourseFrequencyRowView';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { CourseFrequencyRow } from '@/lib/course/courseFrequencies';

export type CourseFrequenciesCardProps = {
  rows: readonly CourseFrequencyRow[];
};

export const CourseFrequenciesCard = ({ rows }: CourseFrequenciesCardProps) => {
  const { t } = useTranslate();
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <>
      <Box className="rounded-2xl border border-border bg-card px-4 py-4" gap="lg">
        <Text size="base" weight="bold">
          {t('course_frequencies_heading')}
        </Text>

        {rows.map((row) => (
          <CourseFrequencyRowView
            key={row.symptomId}
            row={row}
            onPressInfo={() => setIsInfoVisible(true)}
          />
        ))}

        <Text size="2xs" color="foreground-muted" className="leading-relaxed">
          {t('course_frequencies_footer')}
        </Text>
      </Box>

      <CourseFrequencyInfoSheet
        visible={isInfoVisible}
        onClose={() => setIsInfoVisible(false)}
      />
    </>
  );
};
