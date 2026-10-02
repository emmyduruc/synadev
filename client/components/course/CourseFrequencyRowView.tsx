import { SymbolView } from 'expo-symbols';

import { CourseFrequencyTileBar } from '@/components/course/CourseFrequencyTileBar';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { CourseFrequencyRow } from '@/lib/course/courseFrequencies';
import { semanticColors } from '@/lib/ui';

export type CourseFrequencyRowViewProps = {
  row: CourseFrequencyRow;
  onPressInfo?: () => void;
};

export const CourseFrequencyRowView = ({ row, onPressInfo }: CourseFrequencyRowViewProps) => {
  const { t } = useTranslate();

  const countLabel =
    row.unit === 'nights'
      ? t('course_frequency_count_nights', {
          count: row.occurrenceDays,
          documented: row.documentedDays,
        })
      : t('course_frequency_count_days', {
          count: row.occurrenceDays,
          documented: row.documentedDays,
        });

  return (
    <Box gap="sm">
      <Box direction="row" align="center" justify="between">
        <Text size="sm" weight="bold" className="flex-1 pr-3">
          {t(row.labelKey)}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('course_frequency_info_accessibility', {
            symptom: t(row.labelKey),
          })}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={onPressInfo ?? (() => undefined)}>
          <SymbolView
            name={{ ios: 'info.circle', android: 'info', web: 'info' }}
            size={18}
            tintColor={semanticColors.foregroundMuted}
          />
        </TouchableOpacity>
      </Box>

      <Text size="xs" color="foreground-muted">
        {countLabel}
      </Text>

      <CourseFrequencyTileBar filledTiles={row.filledTiles} />
    </Box>
  );
};
