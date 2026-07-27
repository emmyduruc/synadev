import { ProfileSettingsSectionCard } from '@/components/profile/ProfileSettingsSectionCard';
import { useTranslate } from '@/hooks/useTranslate';
import { calculateBmi, formatBmiDisplay } from '@/lib/profile/calculateBmi';
import { formatProfileSettingsValue } from '@/lib/profile/formatProfileSettingsValue';
import type { ProfileSettingsBodyData } from '@/lib/profile/profileSettingsTypes';

export type ProfileSettingsBodyCardProps = {
  data: ProfileSettingsBodyData;
  onEditPress: () => void;
};

export const ProfileSettingsBodyCard = ({
  data,
  onEditPress,
}: ProfileSettingsBodyCardProps) => {
  const { t } = useTranslate();
  const emptyValue = t('profile_personal_empty_value');
  const bmi = calculateBmi(data.heightCm, data.weightKg);

  const heightValue = formatProfileSettingsValue(
    data.heightCm ? t('profile_settings_height_value', { value: data.heightCm }) : '',
    emptyValue,
  );
  const weightValue = formatProfileSettingsValue(
    data.weightKg ? t('profile_settings_weight_value', { value: data.weightKg }) : '',
    emptyValue,
  );

  return (
    <ProfileSettingsSectionCard
      titleKey="profile_settings_body_section_label"
      icon={{ ios: 'figure.stand', android: 'accessibility', web: 'accessibility' }}
      onEditPress={onEditPress}
      fields={[
        {
          labelKey: 'profile_settings_height_label',
          value: heightValue,
        },
        {
          labelKey: 'profile_settings_weight_label',
          value: weightValue,
        },
        {
          labelKey: 'profile_settings_bmi_label',
          value: formatBmiDisplay(bmi, emptyValue),
        },
      ]}
    />
  );
};
