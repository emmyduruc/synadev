import type { HealthRecordLabs } from '@syna/shared-types';

import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

export type HealthRecordLabsFormProps = {
  value: HealthRecordLabs;
  onChange: (value: HealthRecordLabs) => void;
};

const parseOptionalNumber = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const toInputString = (value: number | null): string => {
  if (value === null) {
    return '';
  }

  return String(value);
};

export const HealthRecordLabsForm = ({
  value,
  onChange,
}: HealthRecordLabsFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('health_record_labs_fsh_label')}>
        <TextInput
          value={toInputString(value.fsh)}
          onChangeText={(raw) =>
            onChange({ ...value, fsh: parseOptionalNumber(raw) })
          }
          keyboardType="decimal-pad"
          placeholder={t('health_record_labs_fsh_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('health_record_labs_estradiol_label')}>
        <TextInput
          value={toInputString(value.estradiol)}
          onChangeText={(raw) =>
            onChange({ ...value, estradiol: parseOptionalNumber(raw) })
          }
          keyboardType="decimal-pad"
          placeholder={t('health_record_labs_estradiol_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField
        label={t('health_record_labs_drawn_at_label')}
        hint={t('health_record_labs_drawn_at_hint')}>
        <TextInput
          value={value.drawnAt ?? ''}
          onChangeText={(drawnAt) =>
            onChange({
              ...value,
              drawnAt: drawnAt.trim() ? drawnAt.trim() : null,
            })
          }
          placeholder={t('health_record_labs_drawn_at_placeholder')}
          autoCapitalize="none"
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('health_record_labs_notes_label')}>
        <TextInput
          value={value.notes ?? ''}
          onChangeText={(notes) =>
            onChange({
              ...value,
              notes: notes.trim() ? notes : null,
            })
          }
          placeholder={t('health_record_labs_notes_placeholder')}
          multiline
          containerClassName="rounded-2xl"
          inputClassName="rounded-2xl bg-muted min-h-24"
        />
      </ProfileEditField>
    </>
  );
};
