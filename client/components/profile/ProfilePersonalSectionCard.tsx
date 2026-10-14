import { ProfileSettingsSectionCard } from '@/components/profile/ProfileSettingsSectionCard';
import { useBioData } from '@/hooks/useBioData';
import { useTranslate } from '@/hooks/useTranslate';
import { formatBirthDate } from '@/lib/profile/formatBirthDate';
import { formatProfileSettingsValue } from '@/lib/profile/formatProfileSettingsValue';
import { getAgeYearsFromIsoDate } from '@/lib/profile/getAgeYearsFromIsoDate';
import {
  PROFILE_OPTION_LABEL_KEYS,
  type OriginEthnicityId,
} from '@/lib/profile/profileSettingsCatalog';

export type ProfilePersonalSectionCardProps = {
  origin: OriginEthnicityId | null;
  onEditPress: () => void;
};

export const ProfilePersonalSectionCard = ({
  origin,
  onEditPress,
}: ProfilePersonalSectionCardProps) => {
  const { t, language } = useTranslate();
  const { bioData } = useBioData();
  const emptyValue = t('profile_personal_empty_value');

  const fullName = [bioData.firstName, bioData.lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');

  const birthDateValue = formatBirthDate(bioData.dateOfBirth, language) || emptyValue;
  const ageYears = getAgeYearsFromIsoDate(bioData.dateOfBirth);
  const ageValue =
    ageYears === null
      ? emptyValue
      : t('profile_personal_age_value', { age: ageYears });

  const originValue = origin
    ? t(PROFILE_OPTION_LABEL_KEYS.origin[origin])
    : emptyValue;

  return (
    <ProfileSettingsSectionCard
      titleKey="profile_personal_section_label"
      icon={{ ios: 'person.fill', android: 'person', web: 'person' }}
      onEditPress={onEditPress}
      fields={[
        {
          labelKey: 'profile_personal_name_label',
          value: formatProfileSettingsValue(fullName, emptyValue),
        },
        {
          labelKey: 'profile_personal_birth_date_label',
          value: birthDateValue,
        },
        {
          labelKey: 'profile_personal_age_label',
          value: ageValue,
        },
        {
          labelKey: 'profile_personal_origin_label',
          value: originValue,
        },
      ]}
    />
  );
};
