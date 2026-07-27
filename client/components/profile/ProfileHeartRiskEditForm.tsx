import { ProfileEditField } from '@/components/profile/ProfileEditField';
import {
  FAMILY_CANCER_EXCLUSIVE,
  ProfileMultiOptionChips,
} from '@/components/profile/ProfileMultiOptionChips';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { useTranslate } from '@/hooks/useTranslate';
import {
  FAMILY_CANCER_OPTIONS,
  FAMILY_CARDIOVASCULAR_OPTIONS,
  PCOS_DIAGNOSIS_OPTIONS,
  PREGNANCY_COMPLICATION_OPTIONS,
  PROFILE_OPTION_LABEL_KEYS,
} from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsHeartRiskData } from '@/lib/profile/profileSettingsTypes';

export type ProfileHeartRiskEditFormProps = {
  value: ProfileSettingsHeartRiskData;
  onChange: (value: ProfileSettingsHeartRiskData) => void;
};

export const ProfileHeartRiskEditForm = ({
  value,
  onChange,
}: ProfileHeartRiskEditFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('profile_settings_family_cardiovascular_label')}>
        <ProfileOptionChips
          options={FAMILY_CARDIOVASCULAR_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.familyCardiovascular}
          value={value.familyCardiovascular}
          onChange={(familyCardiovascular) =>
            onChange({ ...value, familyCardiovascular })
          }
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_family_cancer_label')}>
        <ProfileMultiOptionChips
          options={FAMILY_CANCER_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.familyCancer}
          values={value.familyCancer}
          exclusiveOption={FAMILY_CANCER_EXCLUSIVE}
          onChange={(familyCancer) => onChange({ ...value, familyCancer })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_pregnancy_label')}>
        <ProfileOptionChips
          options={PREGNANCY_COMPLICATION_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.pregnancy}
          value={value.pregnancy}
          onChange={(pregnancy) => onChange({ ...value, pregnancy })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_pcos_label')}>
        <ProfileOptionChips
          options={PCOS_DIAGNOSIS_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.pcos}
          value={value.pcos}
          onChange={(pcos) => onChange({ ...value, pcos })}
          equalWidth
        />
      </ProfileEditField>
    </>
  );
};
