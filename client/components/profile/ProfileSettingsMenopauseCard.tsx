import { useRouter } from 'expo-router';

import { ProfileSettingsSectionCard } from '@/components/profile/ProfileSettingsSectionCard';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useMrsIiAssessmentStatus } from '@/hooks/useMrsIiAssessmentStatus';
import { useTranslate } from '@/hooks/useTranslate';
import { PROFILE_OPTION_LABEL_KEYS } from '@/lib/profile/profileSettingsCatalog';
import type { ProfileSettingsMenopauseData } from '@/lib/profile/profileSettingsTypes';
import { ROUTES } from '@/lib/routes';

export type ProfileSettingsMenopauseCardProps = {
  data: ProfileSettingsMenopauseData;
  onEditPress: () => void;
};

export const ProfileSettingsMenopauseCard = ({
  data,
  onEditPress,
}: ProfileSettingsMenopauseCardProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const { isCompleted } = useMrsIiAssessmentStatus();
  const emptyValue = t('profile_personal_empty_value');

  const stageValue = data.stage
    ? t(PROFILE_OPTION_LABEL_KEYS.menopauseStage[data.stage])
    : emptyValue;
  const cycleValue = data.cyclePattern
    ? t(PROFILE_OPTION_LABEL_KEYS.cyclePattern[data.cyclePattern])
    : emptyValue;
  const hormoneValue = data.hormoneTherapy
    ? t(PROFILE_OPTION_LABEL_KEYS.hormoneTherapy[data.hormoneTherapy])
    : emptyValue;
  const mrsScoreValue = isCompleted
    ? t('profile_settings_mrs_score_placeholder')
    : emptyValue;

  return (
    <ProfileSettingsSectionCard
      titleKey="profile_settings_menopause_section_label"
      icon={{ ios: 'leaf.fill', android: 'spa', web: 'spa' }}
      onEditPress={onEditPress}
      fields={[
        {
          labelKey: 'profile_settings_menopause_stage_label',
          value: stageValue,
        },
        {
          labelKey: 'profile_settings_cycle_patterns_label',
          value: cycleValue,
        },
        {
          labelKey: 'profile_settings_hormone_therapy_label',
          value: hormoneValue,
        },
        {
          labelKey: 'profile_settings_mrs_score_label',
          value: mrsScoreValue,
        },
      ]}
      footer={(
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            router.push(ROUTES.assessment.mrsIi);
          }}>
          <Text size="xs" weight="medium" color="primary">
            {t('profile_settings_mrs_open_button')}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};
