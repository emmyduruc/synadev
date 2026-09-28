import type { MoodEntry } from '@syna/shared-types';

import { SymptomEntryMoodChips } from '@/components/symptoms/entry/SymptomEntryMoodChips';
import { SymptomEntryMoodNoteField } from '@/components/symptoms/entry/SymptomEntryMoodNoteField';
import { SymptomEntryMoodScaleField } from '@/components/symptoms/entry/SymptomEntryMoodScaleField';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DEFAULT_MOOD_SCALE_VALUE,
  MOOD_SCALE_MAX,
  type SymptomEntryMoodId,
} from '@/lib/mood/moodLogStorage';
import { cn } from '@/lib/ui';

export type SymptomEntryMoodTabProps = {
  entry: MoodEntry;
  onChange: (next: MoodEntry) => void;
};

export const SymptomEntryMoodTab = ({ entry, onChange }: SymptomEntryMoodTabProps) => {
  const { t } = useTranslate();

  const energy = entry.energy > 0 ? entry.energy : DEFAULT_MOOD_SCALE_VALUE;
  const stress = entry.stress > 0 ? entry.stress : DEFAULT_MOOD_SCALE_VALUE;

  const handleToggleMood = (moodId: SymptomEntryMoodId) => {
    const isSelected = entry.feelings.includes(moodId);
    const feelings = isSelected
      ? entry.feelings.filter((id) => id !== moodId)
      : [...entry.feelings, moodId];

    onChange({ ...entry, primaryMood: null, feelings });
  };

  const renderMedicationChoice = (value: boolean, labelKey: string) => {
    const isSelected = entry.medicationChange === value;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => onChange({ ...entry, medicationChange: value })}
        className={cn(
          'flex-1 items-center justify-center rounded-2xl border px-3 py-3.5',
          isSelected ? 'border-primary-500 bg-primary-500' : 'border-border bg-card',
        )}>
        <Text
          size="sm"
          weight="medium"
          color={isSelected ? 'white' : 'foreground'}
          responsive={false}
          className="text-center">
          {t(labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Box className="rounded-2xl border border-border bg-card px-4 py-4" gap="lg">
      <SymptomEntryMoodChips selectedIds={entry.feelings} onToggle={handleToggleMood} />

      <SymptomEntryMoodScaleField
        label={t('symptom_entry_mood_energy_title')}
        valueLabel={t('symptom_entry_mood_scale_value', {
          value: energy,
          max: MOOD_SCALE_MAX,
        })}
        lowLabel={t('symptom_entry_mood_energy_low')}
        highLabel={t('symptom_entry_mood_energy_high')}
        value={energy}
        onChange={(next) => onChange({ ...entry, energy: next })}
      />

      <SymptomEntryMoodScaleField
        label={t('symptom_entry_mood_stress_title')}
        valueLabel={t('symptom_entry_mood_scale_value', {
          value: stress,
          max: MOOD_SCALE_MAX,
        })}
        lowLabel={t('symptom_entry_mood_stress_low')}
        highLabel={t('symptom_entry_mood_stress_high')}
        value={stress}
        onChange={(next) => onChange({ ...entry, stress: next })}
      />

      <Box gap="sm">
        <Text size="sm" weight="bold">
          {t('symptom_entry_mood_medication_title')}
        </Text>
        <Box direction="row" gap="sm">
          {renderMedicationChoice(true, 'symptom_entry_mood_medication_yes')}
          {renderMedicationChoice(false, 'symptom_entry_mood_medication_no')}
        </Box>
      </Box>

      <SymptomEntryMoodNoteField
        value={entry.note}
        onChange={(note) => onChange({ ...entry, note })}
      />
    </Box>
  );
};
