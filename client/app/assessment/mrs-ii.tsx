import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

import { MenopauseScaleWizard } from '@/components/mrs/MenopauseScaleWizard';
import { useSubmitMrsIiAssessment } from '@/hooks/useSubmitMrsIiAssessment';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';
import { ROUTES } from '@/lib/routes';

/**
 * MRS-II assessment modal — persists answers via POST /assessments/mrs-ii,
 * then replaces itself with the results screen.
 */
const MrsIiAssessmentScreen = () => {
  const router = useRouter();
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
      const submission = await submit(payload);
      router.replace({
        pathname: ROUTES.assessment.mrsIiResults,
        params: {
          total: String(submission.total),
          somatic: String(submission.subscores.somatic),
          psychological: String(submission.subscores.psychological),
          urogenital: String(submission.subscores.urogenital),
        },
      });
    },
    [router, submit],
  );

  return <MenopauseScaleWizard onClose={handleClose} onSave={handleSave} />;
};

export default MrsIiAssessmentScreen;
