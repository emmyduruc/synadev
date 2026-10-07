import type { ClinicalProfile } from '@syna/shared-types';
import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClinicalProfileContent } from '@/components/clinicalProfile/ClinicalProfileContent';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader } from '@/components/ui/AppHeader';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useClinicalProfile } from '@/hooks/useClinicalProfile';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';
import { semanticColors } from '@/lib/ui';

const ClinicalProfileScreen = () => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const {
    profile,
    dataUpdatedAt,
    isLoading,
    isError,
    isSaving,
    saveProfile,
    refetch,
  } = useClinicalProfile();
  const [draft, setDraft] = useState<ClinicalProfile>(profile);
  const didToastLoadErrorRef = useRef(false);

  useEffect(() => {
    if (dataUpdatedAt === 0) {
      return;
    }

    setDraft(profile);
  }, [dataUpdatedAt, profile]);

  useEffect(() => {
    if (!isError || didToastLoadErrorRef.current) {
      return;
    }

    didToastLoadErrorRef.current = true;
    toast.error(t('clinical_profile_load_error'));
  }, [isError, t]);

  const handleSave = async () => {
    try {
      const age = draft.ageAtFirstPeriod;

      if (age !== null && (age < 8 || age > 25)) {
        toast.error(t('clinical_profile_age_invalid'));
        return;
      }

      await saveProfile(draft);
      toast.success(t('clinical_profile_save_success'));
    } catch {
      toast.error(t('clinical_profile_save_error'));
    }
  };

  return (
    <SynaGradientBackground>
      <Box
        flex={1}
        style={{
          paddingTop: safeAreaTop,
          backgroundColor: semanticColors.page.DEFAULT,
        }}>
        <AppHeader title="" fallbackHref={ROUTES.tabs.start} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: safeAreaBottom + 96 }}>
          {isLoading ? (
            <Box padding="lg">
              <Box className="rounded-2xl border border-border bg-card px-5 py-5">
                <Text size="sm" color="foreground-muted" family="sans">
                  {t('clinical_profile_loading')}
                </Text>
              </Box>
            </Box>
          ) : null}

          {!isLoading && isError ? (
            <Box padding="lg" gap="md">
              <Box className="rounded-2xl border border-border bg-card px-5 py-5" gap="sm">
                <Text size="sm" family="sans" className="leading-relaxed">
                  {t('clinical_profile_load_error')}
                </Text>
                <Button
                  fullWidth
                  variant="soft"
                  onPress={() => {
                    didToastLoadErrorRef.current = false;
                    void refetch();
                  }}>
                  {t('clinical_profile_retry')}
                </Button>
              </Box>
            </Box>
          ) : null}

          {!isLoading && !isError ? (
            <ClinicalProfileContent profile={draft} onChange={setDraft} />
          ) : null}
        </ScrollView>

        <Box
          paddingX="lg"
          className="border-t border-border"
          style={{
            paddingBottom: safeAreaBottom + 12,
            paddingTop: 12,
            backgroundColor: semanticColors.page.DEFAULT,
          }}>
          <Button
            fullWidth
            size="lg"
            loading={isSaving}
            disabled={isLoading || isError}
            onPress={() => {
              void handleSave();
            }}>
            {t('clinical_profile_save')}
          </Button>
        </Box>
      </Box>
    </SynaGradientBackground>
  );
};

export default ClinicalProfileScreen;
