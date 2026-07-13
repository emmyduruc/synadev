import { DailyLogChip } from '@/components/dailyLog/DailyLogChip';
import { DailyLogNoteField } from '@/components/dailyLog/DailyLogNoteField';
import { DailyLogScale } from '@/components/dailyLog/DailyLogScale';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { MOOD_OPTIONS, MOOD_SECTION_SURFACE } from '@/lib/mood/moodCatalog';
import type { MoodEntry } from '@/lib/mood/moodLogStorage';
import { cn } from '@/lib/ui';

export type MoodLogSectionsProps = {
  entry: MoodEntry;
  onSelectPrimary: (moodId: string) => void;
  onToggleFeeling: (moodId: string) => void;
  onEnergyChange: (value: number) => void;
  onStressChange: (value: number) => void;
  onNoteChange: (value: string) => void;
};

export const MoodLogSections = ({
  entry,
  onSelectPrimary,
  onToggleFeeling,
  onEnergyChange,
  onStressChange,
  onNoteChange,
}: MoodLogSectionsProps) => {
  const { t } = useTranslate();
  const feelingOptions = MOOD_OPTIONS.filter((option) => option.id !== entry.primaryMood);

  return (
    <Box gap="lg">
      <Box className={cn('rounded-3xl border p-4 shadow-sm', MOOD_SECTION_SURFACE.primary)} gap="sm">
        <Text size="base" weight="bold">
          {t('mood_primary_title')}
        </Text>
        <Box direction="row" className="flex-wrap gap-2">
          {MOOD_OPTIONS.map((option) => (
            <DailyLogChip
              key={option.id}
              label={t(option.labelKey)}
              emoji={option.emoji}
              wellClassName={option.wellClassName}
              isSelected={entry.primaryMood === option.id}
              onPress={() => onSelectPrimary(option.id)}
            />
          ))}
        </Box>
      </Box>

      {entry.primaryMood ? (
        <Box
          className={cn('rounded-3xl border p-4 shadow-sm', MOOD_SECTION_SURFACE.feelings)}
          gap="sm">
          <Text size="base" weight="bold">
            {t('mood_feelings_title')}
          </Text>
          <Box direction="row" className="flex-wrap gap-2">
            {feelingOptions.map((option) => (
              <DailyLogChip
                key={option.id}
                label={t(option.labelKey)}
                emoji={option.emoji}
                wellClassName={option.wellClassName}
                isSelected={entry.feelings.includes(option.id)}
                onPress={() => onToggleFeeling(option.id)}
              />
            ))}
          </Box>
        </Box>
      ) : null}

      <Box className={cn('rounded-3xl border p-4 shadow-sm', MOOD_SECTION_SURFACE.energy)} gap="sm">
        <Text size="base" weight="bold">
          {t('mood_energy_title')}
        </Text>
        <DailyLogScale
          value={entry.energy}
          onChange={onEnergyChange}
          lowLabel={t('mood_energy_low')}
          highLabel={t('mood_energy_high')}
        />
      </Box>

      <Box className={cn('rounded-3xl border p-4 shadow-sm', MOOD_SECTION_SURFACE.stress)} gap="sm">
        <Text size="base" weight="bold">
          {t('mood_stress_title')}
        </Text>
        <DailyLogScale
          value={entry.stress}
          onChange={onStressChange}
          lowLabel={t('mood_stress_low')}
          highLabel={t('mood_stress_high')}
        />
      </Box>

      <Box className={cn('rounded-3xl border p-4 shadow-sm', MOOD_SECTION_SURFACE.note)} gap="sm">
        <Text size="base" weight="bold">
          {t('mood_note_title')}
        </Text>
        <DailyLogNoteField
          value={entry.note}
          onChangeText={onNoteChange}
          placeholder={t('mood_note_placeholder')}
        />
      </Box>
    </Box>
  );
};
