import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

import { MenopauseScaleWizard } from '@/components/mrs/MenopauseScaleWizard';
import { useSubmitMrsIiAssessment } from '@/hooks/useSubmitMrsIiAssessment';
import { useTranslate } from '@/hooks/useTranslate';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

/**
 * MRS-II assessment modal — persists answers via POST /assessments/mrs-ii.
 */
const MrsIiAssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { submit } = useSubmitMrsIiAssessment();

  // Leaving the questionnaire always returns to the dashboard, even when it was
  // opened from profile settings (pops any modals in between).
  const handleClose = useCallback(() => {
    router.dismissTo(ROUTES.tabs.start);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClose();
        return true;
      });

      return () => subscription.remove();
    }, [handleClose]),
  );

  const handleSave = useCallback(
    async (payload: MrsIiSubmissionPayload) => {
      await submit(payload);
      toast.success(t('mrs_ii_save_success_title'), {
        description: t('mrs_ii_save_success_description'),
      });
      router.back();
    },
    [router, submit, t],
  );

  return <MenopauseScaleWizard onClose={handleClose} onSave={handleSave} />;
};

export default MrsIiAssessmentScreen;
