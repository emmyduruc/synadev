import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export type BackButtonProps = {
  fallbackHref?: Href;
  onPress?: () => void;
  iconColor?: string;
};

export const BackButton = ({
  fallbackHref = ROUTES.welcome,
  onPress,
  iconColor = semanticColors.foregroundMuted,
}: BackButtonProps) => {
  const router = useRouter();
  const { t } = useTranslate();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={t('header_back_accessibility_label')}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      onPress={handlePress}
      style={styles.button}>
      <ChevronLeftIcon color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
