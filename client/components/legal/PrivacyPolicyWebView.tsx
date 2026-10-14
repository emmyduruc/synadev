import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { Box, Text } from '@/components/ui';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTranslate } from '@/hooks/useTranslate';
import { PRIVACY_POLICY_URL } from '@/lib/legal/urls';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export const PrivacyPolicyWebView = () => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box
      flex={1}
      className="bg-background"
      style={{ paddingTop: safeAreaTop, paddingBottom: safeAreaBottom }}
    >
      <AppHeader title={t('privacy_policy_screen_title')} fallbackHref={ROUTES.register} />
      <Box flex={1} className="relative">
        <WebView
          source={{ uri: PRIVACY_POLICY_URL }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState
          style={{ flex: 1 }}
        />
        {isLoading ? (
          <Box
            align="center"
            justify="center"
            className="absolute inset-0 bg-background/80"
          >
            <ActivityIndicator color={semanticColors.foreground} />
            <Text size="sm" color="foreground-muted" className="mt-3">
              {t('privacy_policy_loading')}
            </Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
