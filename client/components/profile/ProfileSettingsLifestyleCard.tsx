import { ProfileSettingsSectionCard } from '@/components/profile/ProfileSettingsSectionCard';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_OPTION_LABEL_KEYS } from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsLifestyleData } from '@/lib/profile/profileSettingsTypes';

export type ProfileSettingsLifestyleCardProps = {
  data: ProfileSettingsLifestyleData;
  onEditPress: () => void;
};

export const ProfileSettingsLifestyleCard = ({
  data,
  onEditPress,
}: ProfileSettingsLifestyleCardProps) => {
  const { t } = useTranslate();
  const emptyValue = t('profile_personal_empty_value');

  const smoking = data.smoking
    ? t(PROFILE_OPTION_LABEL_KEYS.smoking[data.smoking])
    : emptyValue;
  const socialBond = data.socialBond
    ? t(PROFILE_OPTION_LABEL_KEYS.socialBond[data.socialBond])
    : emptyValue;
  const sport = data.sport
    ? t(PROFILE_OPTION_LABEL_KEYS.sport[data.sport])
    : emptyValue;
  const wearable = data.wearable
    ? t(PROFILE_OPTION_LABEL_KEYS.wearable[data.wearable])
    : emptyValue;

  return (
    <ProfileSettingsSectionCard
      titleKey="profile_settings_lifestyle_section_label"
      icon={{ ios: 'figure.run', android: 'directions_run', web: 'directions_run' }}
      onEditPress={onEditPress}
      fields={[
        {
          labelKey: 'profile_settings_smoking_label',
          value: smoking,
        },
        {
          labelKey: 'profile_settings_social_bond_label',
          value: socialBond,
        },
        {
          labelKey: 'profile_settings_sport_label',
          value: sport,
        },
        {
          labelKey: 'profile_settings_wearable_label',
          value: wearable,
        },
      ]}
    />
  );
};
