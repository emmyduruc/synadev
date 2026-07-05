import { SymbolView } from 'expo-symbols';

import { Box, Tag, TAG_ICON_POSITION, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import {
  PROFILE_MISSING_FIELD,
  PROFILE_MISSING_FIELDS,
  type ProfileMissingFieldId,
} from '@/lib/profile/constants';
import { semanticColors } from '@/lib/ui';

const missingFieldLabelKey: Record<ProfileMissingFieldId, string> = {
  [PROFILE_MISSING_FIELD.bodyMetrics]: 'profile_missing_body_metrics',
  [PROFILE_MISSING_FIELD.origin]: 'profile_missing_origin',
  [PROFILE_MISSING_FIELD.smokingStatus]: 'profile_missing_smoking_status',
  [PROFILE_MISSING_FIELD.socialConnection]: 'profile_missing_social_connection',
};

export const ProfileMissingPatternsCard = () => {
  const { t } = useTranslate();

  return (
    <Box gap="md" className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Box direction="row" align="center" gap="sm">
        <SymbolView
          name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
          size={18}
          tintColor={semanticColors.splashBackground}
        />
        <Text size="sm" weight="semibold" color="primary" className="flex-1">
          {t('profile_missing_patterns_title')}
        </Text>
      </Box>

      <Box direction="row" className="flex-wrap gap-2">
        {PROFILE_MISSING_FIELDS.map((fieldId) => (
          <Tag
            key={fieldId}
            label={t(missingFieldLabelKey[fieldId])}
            iconPosition={TAG_ICON_POSITION.left}
            icon={
              <SymbolView
                name={{ ios: 'plus', android: 'add', web: 'add' }}
                size={12}
                tintColor={semanticColors.foreground}
              />
            }
          />
        ))}
      </Box>

      <Text size="xs" color="foreground-muted" className="italic leading-relaxed">
        {t('profile_missing_patterns_hint')}
      </Text>
    </Box>
  );
};
