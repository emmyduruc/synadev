import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';

import { ProfilePlatformHealthIcon } from '@/components/profile/ProfilePlatformHealthIcon';
import { Box, Button, Tag, Text, TouchableOpacity } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { HEALTH_METRIC_LABEL_KEY, isHealthMetricKey } from '@/lib/health/metricCatalog';
import { PLATFORM_OS, semanticColors } from '@/lib/ui';

const getPlatformHealthCopy = (
  t: (key: string) => string,
): { title: string; subtitle: string } => {
  if (Platform.OS === PLATFORM_OS.ios) {
    return {
      title: t('profile_health_apple_title'),
      subtitle: t('profile_health_apple_subtitle'),
    };
  }

  if (Platform.OS === PLATFORM_OS.android) {
    return {
      title: t('profile_health_android_title'),
      subtitle: t('profile_health_android_subtitle'),
    };
  }

  return {
    title: t('profile_health_unsupported_title'),
    subtitle: t('profile_health_unsupported_subtitle'),
  };
};

const getPermissionsHintKey = (): string => {
  if (Platform.OS === PLATFORM_OS.android) {
    return 'profile_health_sources_hint_android';
  }

  if (Platform.OS === PLATFORM_OS.ios) {
    return 'profile_health_sources_hint_ios';
  }

  return 'profile_health_sources_hint_unsupported';
};

export type ProfileHealthSourcesCardProps = {
  isConnected: boolean;
  connectedMetricKeys: readonly string[];
  isConnecting: boolean;
  errorMessage: string | null;
  onConnect: () => void;
};

export const ProfileHealthSourcesCard = ({
  isConnected,
  connectedMetricKeys,
  isConnecting,
  errorMessage,
  onConnect,
}: ProfileHealthSourcesCardProps) => {
  const { t } = useTranslate();
  const platformCopy = getPlatformHealthCopy(t);
  const isSupportedPlatform =
    Platform.OS === PLATFORM_OS.ios || Platform.OS === PLATFORM_OS.android;

  const permissionsHintKey = getPermissionsHintKey();

  return (
    <Box gap="md" className="rounded-2xl border border-white/60 bg-white/90 p-5">
      <Box direction="row" align="center" justify="between" gap="sm">
        <Box direction="row" align="center" gap="sm" flex={1}>
          <SymbolView
            name={{ ios: 'link', android: 'link', web: 'link' }}
            size={18}
            tintColor={semanticColors.foreground}
          />
          <Text size="sm" weight="semibold" className="flex-1">
            {t('profile_health_sources_title')}
          </Text>
        </Box>

        {isSupportedPlatform && isConnected ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('profile_health_sync_button')}
            disabled={isConnecting}
            onPress={onConnect}
            style={styles.syncButton}>
            {isConnecting ? (
              <ActivityIndicator color={semanticColors.splashBackground} size="small" />
            ) : (
              <SymbolView
                name={{
                  ios: 'arrow.triangle.2.circlepath',
                  android: 'sync',
                  web: 'sync',
                }}
                size={20}
                tintColor={semanticColors.splashBackground}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </Box>

      <Box
        direction="row"
        align="center"
        gap="md"
        className="rounded-xl bg-lavender-light/60 px-4 py-3">
        <Box className="rounded-full bg-white p-2.5">
          <ProfilePlatformHealthIcon />
        </Box>
        <Box flex={1} gap="xs">
          <Text size="sm" weight="semibold">
            {platformCopy.title}
          </Text>
          <Text size="xs" color="foreground-muted" className="leading-relaxed">
            {platformCopy.subtitle}
          </Text>
        </Box>
      </Box>

      {isConnected && connectedMetricKeys.length > 0 ? (
        <Box direction="row" className="flex-wrap gap-2">
          {connectedMetricKeys.map((metricKey) => {
            if (!isHealthMetricKey(metricKey)) {
              return null;
            }

            return (
              <Tag
                key={metricKey}
                label={t(HEALTH_METRIC_LABEL_KEY[metricKey])}
              />
            );
          })}
        </Box>
      ) : null}

      {errorMessage ? (
        <Text size="xs" color="error">
          {errorMessage}
        </Text>
      ) : null}

      {isSupportedPlatform && !isConnected ? (
        <Button fullWidth size="md" loading={isConnecting} onPress={onConnect}>
          {t('profile_health_connect_button')}
        </Button>
      ) : null}

      <Text size="2xs" color="foreground-muted" className="leading-relaxed">
        {t(permissionsHintKey)}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  syncButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
