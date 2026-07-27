import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { useTranslate } from '@/hooks/useTranslate';
import {
  PROFILE_OPTION_LABEL_KEYS,
  SMOKING_STATUS_OPTIONS,
  SOCIAL_BOND_OPTIONS,
  SPORT_FREQUENCY_OPTIONS,
  WEARABLE_OPTIONS,
} from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsLifestyleData } from '@/lib/profile/profileSettingsTypes';

export type ProfileLifestyleEditFormProps = {
  value: ProfileSettingsLifestyleData;
  onChange: (value: ProfileSettingsLifestyleData) => void;
};

export const ProfileLifestyleEditForm = ({
  value,
  onChange,
}: ProfileLifestyleEditFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('profile_settings_smoking_label')}>
        <ProfileOptionChips
          options={SMOKING_STATUS_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.smoking}
          value={value.smoking}
          onChange={(smoking) => onChange({ ...value, smoking })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_social_bond_label')}>
        <ProfileOptionChips
          options={SOCIAL_BOND_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.socialBond}
          value={value.socialBond}
          onChange={(socialBond) => onChange({ ...value, socialBond })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_sport_label')}>
        <ProfileOptionChips
          options={SPORT_FREQUENCY_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.sport}
          value={value.sport}
          onChange={(sport) => onChange({ ...value, sport })}
        />
      </ProfileEditField>

      <ProfileEditField
        label={t('profile_settings_wearable_label')}
        hint={t('profile_settings_wearable_hint')}>
        <ProfileOptionChips
          options={WEARABLE_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.wearable}
          value={value.wearable}
          onChange={(wearable) => onChange({ ...value, wearable })}
        />
      </ProfileEditField>
    </>
  );
};
