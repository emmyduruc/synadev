import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { TextInput } from '@/components/ui/TextInput';
import { WizardDateWheel } from '@/components/wizard/WizardDateWheel';
import { useTranslate } from '@/hooks/useTranslate';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  ORIGIN_ETHNICITY_OPTIONS,
  PROFILE_OPTION_LABEL_KEYS,
} from '@/lib/profile/profileSettingsCatalog';
import type { OriginEthnicityId } from '@/lib/profile/profileSettingsCatalog';

export type ProfilePersonalEditFormProps = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  origin: OriginEthnicityId | null;
  onChangeBio: (patch: Partial<Pick<BioData, 'firstName' | 'lastName' | 'dateOfBirth'>>) => void;
  onChangeOrigin: (origin: OriginEthnicityId) => void;
};

export const ProfilePersonalEditForm = ({
  firstName,
  lastName,
  dateOfBirth,
  origin,
  onChangeBio,
  onChangeOrigin,
}: ProfilePersonalEditFormProps) => {
  const { t } = useTranslate();

  return (
    <>
      <ProfileEditField label={t('profile_personal_first_name_label')}>
        <TextInput
          value={firstName}
          onChangeText={(next) => onChangeBio({ firstName: next })}
          autoCapitalize="words"
          autoComplete="given-name"
          placeholder={t('profile_personal_first_name_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_personal_last_name_label')}>
        <TextInput
          value={lastName}
          onChangeText={(next) => onChangeBio({ lastName: next })}
          autoCapitalize="words"
          autoComplete="family-name"
          placeholder={t('profile_personal_last_name_placeholder')}
          containerClassName="rounded-full"
          inputClassName="rounded-full bg-muted"
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_personal_birth_date_label')}>
        <WizardDateWheel
          value={dateOfBirth}
          onChange={(next) => onChangeBio({ dateOfBirth: next })}
        />
      </ProfileEditField>

      <ProfileEditField label={t('profile_personal_origin_label')}>
        <ProfileOptionChips
          options={ORIGIN_ETHNICITY_OPTIONS}
          labelKeys={PROFILE_OPTION_LABEL_KEYS.origin}
          value={origin}
          onChange={onChangeOrigin}
        />
      </ProfileEditField>
    </>
  );
};
