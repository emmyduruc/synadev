import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { MenopauseScaleWizard } from '@/components/mrs/MenopauseScaleWizard';
import { useSubmitMrsIiAssessment } from '@/hooks/useSubmitMrsIiAssessment';
import { useTranslate } from '@/hooks/useTranslate';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';
import { toast } from '@/lib/sonner';

/**
 * MRS-II assessment modal — persists answers via POST /assessments/mrs-ii.
 */
const MrsIiAssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { submit } = useSubmitMrsIiAssessment();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

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
