import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box, Button, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { HEALTH_READ_STATUS } from '@/lib/health/constants';
import {
  saveHealthConnectionSummary,
  toHealthConnectionSummary,
} from '@/lib/health/healthConnectionSummary';
import { readHealthSnapshot } from '@/lib/health/healthData';
import type { HealthRawSnapshot } from '@/lib/health/types';

const StartTabScreen = () => {
  const { t } = useTranslate();
  const [healthSnapshot, setHealthSnapshot] = useState<HealthRawSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectHealth = async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      const snapshot = await readHealthSnapshot();
      setHealthSnapshot(snapshot);
      await saveHealthConnectionSummary(toHealthConnectionSummary(snapshot));

      if (snapshot.status === HEALTH_READ_STATUS.error) {
        const firstError = snapshot.metrics.find((metric) => metric.error)?.error;
        setErrorMessage(firstError ?? t('health_connect_error_title'));
      }
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : String(error_);
      setErrorMessage(message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SynaGradientBackground>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_start_title')} showBack={false} />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <Box flex={1} padding="lg" gap="md">
              <Box gap="sm" className="rounded-2xl border border-white/60 bg-white/90 p-5">
                <Text size="2xl" weight="bold" align="center">
                  {t('health_connect_title')}
                </Text>
                <Text size="sm" color="foreground-muted" align="center" className="leading-relaxed">
                  {t('health_connect_subtitle')}
                </Text>
                <Button
                  fullWidth
                  size="lg"
                  loading={isConnecting}
                  onPress={handleConnectHealth}>
                  {t('health_connect_button')}
                </Button>
                <Text size="2xs" color="foreground-muted" align="center" className="leading-relaxed">
                  {t('health_connect_rebuild_hint')}
                </Text>
              </Box>

              {errorMessage ? (
                <Box className="rounded-2xl border border-error-500/30 bg-white/90 p-4">
                  <Text size="sm" weight="semibold" color="error">
                    {t('health_connect_error_title')}
                  </Text>
                  <Text size="xs" color="error" className="mt-2">
                    {errorMessage}
                  </Text>
                </Box>
              ) : null}

              {healthSnapshot ? (
                <Box gap="sm" className="rounded-2xl border border-white/60 bg-white/90 p-4">
                  <Text size="sm" weight="semibold">
                    {t('health_connect_raw_payload_title')}
                  </Text>
                  <Text size="2xs" color="foreground-muted">
                    {t('health_connect_raw_payload_hint')}
                  </Text>
                  <Box className="rounded-xl bg-slate p-3">
                    <Text
                      size="2xs"
                      color="white"
                      responsive={false}
                      className="font-mono leading-4">
                      {JSON.stringify(healthSnapshot, null, 2)}
                    </Text>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaView>
    </SynaGradientBackground>
  );
};

export default StartTabScreen;
