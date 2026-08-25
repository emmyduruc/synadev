import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

export type HealthRecordConcernsFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export const HealthRecordConcernsForm = ({
  value,
  onChange,
}: HealthRecordConcernsFormProps) => {
  const { t } = useTranslate();

  return (
    <ProfileEditField
      label={t('health_record_concerns_label')}
      hint={t('health_record_concerns_hint')}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t('health_record_concerns_placeholder')}
        multiline
        containerClassName="rounded-2xl"
        inputClassName="rounded-2xl bg-muted min-h-32"
      />
    </ProfileEditField>
  );
};
