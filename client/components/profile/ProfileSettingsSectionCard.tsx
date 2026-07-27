import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type ProfileSettingsField = {
  labelKey: string;
  value: string;
};

export type ProfileSettingsSectionCardProps = {
  titleKey: string;
  icon: SymbolViewProps['name'];
  fields: readonly ProfileSettingsField[];
  onEditPress?: () => void;
  footer?: ReactNode;
};

export const ProfileSettingsSectionCard = ({
  titleKey,
  icon,
  fields,
  onEditPress,
  footer,
}: ProfileSettingsSectionCardProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md" className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Box direction="row" align="center" justify="between">
        <Box direction="row" align="center" gap="sm" className="flex-1 pr-3">
          <SymbolView
            name={icon}
            size={16}
            tintColor={semanticColors.splashBackground}
          />
          <Text
            size="2xs"
            weight="semibold"
            color="primary"
            className="tracking-widest">
            {t(titleKey)}
          </Text>
        </Box>

        {onEditPress ? (
          <TouchableOpacity accessibilityRole="button" onPress={onEditPress}>
            <Box direction="row" align="center" gap="xs">
              <SymbolView
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                size={14}
                tintColor={semanticColors.splashBackground}
              />
              <Text size="xs" weight="medium" color="primary">
                {t('profile_personal_edit_button')}
              </Text>
            </Box>
          </TouchableOpacity>
        ) : null}
      </Box>

      <Box gap="sm">
        {fields.map((field) => (
          <Box key={field.labelKey} direction="row" justify="between" gap="md">
            <Text size="sm" color="foreground-muted" className="flex-1">
              {t(field.labelKey)}
            </Text>
            <Text size="sm" weight="medium" className="shrink-0 text-right">
              {field.value}
            </Text>
          </Box>
        ))}
      </Box>

      {footer}
    </Box>
  );
};
