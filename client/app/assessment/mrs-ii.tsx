import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { MenopauseScaleWizard } from '@/components/mrs/MenopauseScaleWizard';
import { useTranslate } from '@/hooks/useTranslate';
import { setMrsIiAssessmentCompleted } from '@/lib/mrs/mrsIiBannerStorage';
import type { MrsIiSubmissionPayload } from '@/lib/mrs/mrsIiTypes';
import { toast } from '@/lib/sonner';

/**
 * MRS-II assessment modal — UI only; payload is prepared for a future API.
 */
const MrsIiAssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(
    async (_payload: MrsIiSubmissionPayload) => {
      // UI-only for now — `_payload` is the record mapped for a future API.
      await setMrsIiAssessmentCompleted();
      toast.success(t('mrs_ii_save_success_title'), {
        description: t('mrs_ii_save_success_description'),
      });
      router.back();
    },
    [router, t],
  );

  return <MenopauseScaleWizard onClose={handleClose} onSave={handleSave} />;
};

export default MrsIiAssessmentScreen;
