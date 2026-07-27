import { ProfileSettingsSectionCard } from '@/components/profile/ProfileSettingsSectionCard';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_OPTION_LABEL_KEYS } from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsHeartRiskData } from '@/lib/profile/profileSettingsTypes';

export type ProfileSettingsHeartRiskCardProps = {
  data: ProfileSettingsHeartRiskData;
  onEditPress: () => void;
};

export const ProfileSettingsHeartRiskCard = ({
  data,
  onEditPress,
}: ProfileSettingsHeartRiskCardProps) => {
  const { t } = useTranslate();
  const emptyValue = t('profile_personal_empty_value');

  const familyCardiovascular = data.familyCardiovascular
    ? t(PROFILE_OPTION_LABEL_KEYS.familyCardiovascular[data.familyCardiovascular])
    : emptyValue;

  let familyCancer = emptyValue;

  if (data.familyCancer.length > 0) {
    familyCancer = data.familyCancer
      .map((id) => t(PROFILE_OPTION_LABEL_KEYS.familyCancer[id]))
      .join(', ');
  }

  const pregnancy = data.pregnancy
    ? t(PROFILE_OPTION_LABEL_KEYS.pregnancy[data.pregnancy])
    : emptyValue;
  const pcos = data.pcos
    ? t(PROFILE_OPTION_LABEL_KEYS.pcos[data.pcos])
    : emptyValue;

  return (
    <ProfileSettingsSectionCard
      titleKey="profile_settings_heart_risk_section_label"
      icon={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
      onEditPress={onEditPress}
      fields={[
        {
          labelKey: 'profile_settings_family_cardiovascular_label',
          value: familyCardiovascular,
        },
        {
          labelKey: 'profile_settings_family_cancer_label',
          value: familyCancer,
        },
        {
          labelKey: 'profile_settings_pcos_label',
          value: pcos,
        },
        {
          labelKey: 'profile_settings_pregnancy_label',
          value: pregnancy,
        },
      ]}
    />
  );
};
