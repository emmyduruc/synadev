import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { useTranslate } from '@/hooks/useTranslate';
import {
  CYCLE_PATTERN_OPTIONS,
  HORMONE_THERAPY_OPTIONS,
  MENOPAUSE_STAGE_OPTIONS,
  PROFILE_OPTION_LABEL_KEYS,
} from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsMenopauseData } from '@/lib/profile/profileSettingsTypes';

export type ProfileMenopauseEditFormProps = {
  value: ProfileSettingsMenopauseData;
  onChange: (value: ProfileSettingsMenopauseData) => void;
};

export const ProfileMenopauseEditForm = ({
  value,
  onChange,
}: ProfileMenopauseEditFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('profile_settings_menopause_stage_label')}>
        <ProfileOptionChips
          options={MENOPAUSE_STAGE_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.menopauseStage}
          value={value.stage}
          onChange={(stage) => onChange({ ...value, stage })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_cycle_patterns_label')}>
        <ProfileOptionChips
          options={CYCLE_PATTERN_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.cyclePattern}
          value={value.cyclePattern}
          onChange={(cyclePattern) => onChange({ ...value, cyclePattern })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_settings_hormone_therapy_label')}>
        <ProfileOptionChips
          options={HORMONE_THERAPY_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.hormoneTherapy}
          value={value.hormoneTherapy}
          onChange={(hormoneTherapy) => onChange({ ...value, hormoneTherapy })}
        />
      </ProfileEditField>
    </>
  );
};
