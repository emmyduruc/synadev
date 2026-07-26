import { SymbolView } from 'expo-symbols';

import { Banner } from '@/components/ui/Banner';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

export type PatientActivationMeasureBannerProps = {
  onPress?: () => void;
  onDismiss: () => void;
};

export const PatientActivationMeasureBanner = ({
  onPress,
  onDismiss,
}: PatientActivationMeasureBannerProps) => {
  const { t } = useTranslate();

  return (
    <Banner onDismiss={onDismiss}>
      <TouchableOpacity accessibilityRole="button" onPress={onPress}>
        <Box
          direction="row"
          align="center"
          gap="md"
          className="rounded-2xl border border-white/60 bg-white/90 p-5 pr-10">
          <Box
            align="center"
            justify="center"
            className="h-12 w-12 rounded-full border border-lavender bg-lavender-light">
            <SymbolView
              name={{
                ios: 'person.fill.checkmark',
                android: 'person',
                web: 'person',
              }}
              size={22}
              tintColor={semanticColors.dashboardIcon.insight}
            />
          </Box>
          <Box flex={1} gap="xs">
            <Text size="sm" weight="semibold" className="leading-snug">
              {t('patient_activation_measure_banner_title')}
            </Text>
            <Box direction="row" align="center" gap="xs">
              <Text size="xs" color="foreground" className="flex-1 leading-relaxed">
                {t('patient_activation_measure_banner_subtitle')}
              </Text>
              <SymbolView
                name={{
                  ios: 'chevron.right',
                  android: 'chevron_right',
                  web: 'chevron_right',
                }}
                size={14}
                tintColor={semanticColors.foregroundMuted}
              />
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Banner>
  );
};
