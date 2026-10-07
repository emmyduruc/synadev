import type { ClinicalProfile } from '@syna/shared-types';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClinicalProfileContent } from '@/components/clinicalProfile/ClinicalProfileContent';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
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
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { profile, isLoading, isSaving, saveProfile } = useClinicalProfile();
  const [draft, setDraft] = useState<ClinicalProfile>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

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
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader
            title={t('clinical_profile_header')}
            fallbackHref={ROUTES.tabs.start}
          />

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
            ) : (
              <ClinicalProfileContent profile={draft} onChange={setDraft} />
            )}
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
              disabled={isLoading}
              onPress={() => {
                void handleSave();
              }}>
              {t('clinical_profile_save')}
            </Button>
          </Box>
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default ClinicalProfileScreen;
