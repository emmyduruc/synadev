import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { Box } from '@/components/ui/Box';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';
import { calculateBmi, formatBmiDisplay } from '@/lib/profile/calculateBmi';
import type { ProfileSettingsBodyData } from '@/lib/profile/profileSettingsTypes';

export type ProfileBodyEditFormProps = {
  value: ProfileSettingsBodyData;
  onChange: (value: ProfileSettingsBodyData) => void;
};

export const ProfileBodyEditForm = ({
  value,
  onChange,
}: ProfileBodyEditFormProps) => {
  const { t } = useTranslate();
  const bmi = calculateBmi(value.heightCm, value.weightKg);
  const bmiDisplay = formatBmiDisplay(bmi, t('profile_personal_empty_value'));

  return (
    <>
      <Box direction="row" gap="md">
        <Box flex={1}>
          <ProfileEditField label={t('profile_settings_height_cm_label')}>
            <TextInput
              value={value.heightCm}
              onChangeText={(heightCm) => onChange({ ...value, heightCm })}
              keyboardType="decimal-pad"
              placeholder={t('profile_settings_height_placeholder')}
              containerClassName="rounded-full"
              inputClassName="rounded-full bg-muted"
            />
          </ProfileEditField>
        </Box>
        <Box flex={1}>
          <ProfileEditField label={t('profile_settings_weight_kg_label')}>
            <TextInput
              value={value.weightKg}
              onChangeText={(weightKg) => onChange({ ...value, weightKg })}
              keyboardType="decimal-pad"
              placeholder={t('profile_settings_weight_placeholder')}
              containerClassName="rounded-full"
              inputClassName="rounded-full bg-muted"
            />
          </ProfileEditField>
        </Box>
      </Box>

      <ProfileEditField
        label={t('profile_settings_waist_cm_label')}
        hint={t('profile_settings_waist_optional_hint')}>
        <TextInput
          value={value.waistCm}
          onChangeText={(waistCm) => onChange({ ...value, waistCm })}
          keyboardType="decimal-pad"
          placeholder={t('profile_settings_waist_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField
        label={t('profile_settings_bmi_label')}
        hint={t('profile_settings_bmi_auto_hint')}>
        <TextInput
          value={bmiDisplay}
          disabled
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>
    </>
  );
};
