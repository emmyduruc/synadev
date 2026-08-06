import { DeepeningDaySlider } from '@/components/deepening/DeepeningDaySlider';
import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';
import {
  MIGRAINE_AURA_LABEL_KEYS,
  MIGRAINE_AURA_OPTIONS,
  MIGRAINE_DIAGNOSIS_LABEL_KEYS,
  MIGRAINE_DIAGNOSIS_OPTIONS,
  MIGRAINE_HRT_LABEL_KEYS,
  MIGRAINE_HRT_OPTIONS,
} from '@/lib/deepening/deepeningCatalog';
import type { DeepeningMigraineValue } from '@/lib/deepening/deepeningTypes';

export type DeepeningMigraineFormProps = {
  value: DeepeningMigraineValue;
  onChange: (value: DeepeningMigraineValue) => void;
};

export const DeepeningMigraineForm = ({
  value,
  onChange,
}: DeepeningMigraineFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('deepening_migraine_diagnosis_label')}>
        <ProfileOptionChips
          options={MIGRAINE_DIAGNOSIS_OPTIONS}
          labelKeys={MIGRAINE_DIAGNOSIS_LABEL_KEYS}
          value={value.diagnosis}
          onChange={(diagnosis) => onChange({ ...value, diagnosis })}
          stack
        />
      </ProfileEditField>

      <ProfileEditField label={t('deepening_migraine_aura_label')}>
        <ProfileOptionChips
          options={MIGRAINE_AURA_OPTIONS}
          labelKeys={MIGRAINE_AURA_LABEL_KEYS}
          value={value.aura}
          onChange={(aura) => onChange({ ...value, aura })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('deepening_migraine_days_label')}>
        <DeepeningDaySlider
          value={value.daysPerMonth}
          onChange={(daysPerMonth) => onChange({ ...value, daysPerMonth })}
          valueLabel={t('deepening_migraine_days_value', {
            count: value.daysPerMonth,
          })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('deepening_migraine_medication_label')}>
        <TextInput
          value={value.medication}
          onChangeText={(medication) => onChange({ ...value, medication })}
          placeholder={t('deepening_migraine_medication_placeholder')}
          multiline
          containerClassName="rounded-2xl"
          inputClassName="rounded-2xl bg-muted min-h-16"
        />
      </ProfileEditField>

      <ProfileEditField label={t('deepening_migraine_hrt_label')}>
        <ProfileOptionChips
          options={MIGRAINE_HRT_OPTIONS}
          labelKeys={MIGRAINE_HRT_LABEL_KEYS}
          value={value.hrtStatus}
          onChange={(hrtStatus) => onChange({ ...value, hrtStatus })}
        />
      </ProfileEditField>

      <Text size="xs" color="foreground-muted" className="italic leading-relaxed">
        {t('deepening_migraine_hrt_footnote')}
      </Text>
    </>
  );
};
