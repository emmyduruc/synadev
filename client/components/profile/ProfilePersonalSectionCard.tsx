import { SymbolView } from 'expo-symbols';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { STATIC_PROFILE } from '@/lib/profile/constants';
import { semanticColors } from '@/lib/ui';

export type ProfilePersonalSectionCardProps = {
  onEditPress?: () => void;
};

export const ProfilePersonalSectionCard = ({ onEditPress }: ProfilePersonalSectionCardProps) => {
  const { t } = useTranslate();
  const originValue = STATIC_PROFILE.origin ?? t('profile_personal_empty_value');

  return (
    <Box gap="md" className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Box direction="row" align="center" justify="between">
        <Box direction="row" align="center" gap="sm">
          <SymbolView
            name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
            size={16}
            tintColor={semanticColors.foregroundMuted}
          />
          <Text size="2xs" weight="semibold" color="foreground-muted" className="tracking-widest">
            {t('profile_personal_section_label')}
          </Text>
        </Box>

        <TouchableOpacity accessibilityRole="button" onPress={onEditPress}>
          <Box direction="row" align="center" gap="xs">
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={14}
              tintColor={semanticColors.foregroundMuted}
            />
            <Text size="xs" weight="medium" color="foreground-muted">
              {t('profile_personal_edit_button')}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>

      <Box gap="sm">
        <Box direction="row" justify="between" gap="md">
          <Text size="sm" color="foreground-muted">
            {t('profile_personal_name_label')}
          </Text>
          <Text size="sm" weight="medium">
            {STATIC_PROFILE.name}
          </Text>
        </Box>
        <Box direction="row" justify="between" gap="md">
          <Text size="sm" color="foreground-muted">
            {t('profile_personal_age_label')}
          </Text>
          <Text size="sm" weight="medium">
            {t('profile_personal_age_value', { age: STATIC_PROFILE.ageYears })}
          </Text>
        </Box>
        <Box direction="row" justify="between" gap="md">
          <Text size="sm" color="foreground-muted">
            {t('profile_personal_origin_label')}
          </Text>
          <Text size="sm" weight="medium">
            {originValue}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
