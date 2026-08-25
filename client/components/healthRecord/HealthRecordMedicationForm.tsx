import type { HealthRecordMedication } from '@syna/shared-types';

import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

export type HealthRecordMedicationFormProps = {
  value: HealthRecordMedication;
  onChange: (value: HealthRecordMedication) => void;
};

export const HealthRecordMedicationForm = ({
  value,
  onChange,
}: HealthRecordMedicationFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('health_record_meds_name_label')}>
        <TextInput
          value={value.name}
          onChangeText={(name) => onChange({ ...value, name })}
          placeholder={t('health_record_meds_name_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('health_record_meds_dose_label')}>
        <TextInput
          value={value.dose ?? ''}
          onChangeText={(dose) =>
            onChange({
              ...value,
              dose: dose.trim() ? dose : null,
            })
          }
          placeholder={t('health_record_meds_dose_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField
        label={t('health_record_meds_started_at_label')}
        hint={t('health_record_meds_started_at_hint')}>
        <TextInput
          value={value.startedAt ?? ''}
          onChangeText={(startedAt) =>
            onChange({
              ...value,
              startedAt: startedAt.trim() ? startedAt.trim() : null,
            })
          }
          placeholder={t('health_record_meds_started_at_placeholder')}
          autoCapitalize="none"
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('health_record_meds_notes_label')}>
        <TextInput
          value={value.notes ?? ''}
          onChangeText={(notes) =>
            onChange({
              ...value,
              notes: notes.trim() ? notes : null,
            })
          }
          placeholder={t('health_record_meds_notes_placeholder')}
          multiline
          containerClassName="rounded-2xl"
          inputClassName="rounded-2xl bg-muted min-h-24"
        />
      </ProfileEditField>
    </>
  );
};
