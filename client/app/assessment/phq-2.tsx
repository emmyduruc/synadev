import type { SubmitPhq2Assessment } from '@syna/shared-types';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Phq2Wizard } from '@/components/phq2/Phq2Wizard';
import { useSubmitPhq2Assessment } from '@/hooks/useSubmitPhq2Assessment';
import { useTranslate } from '@/hooks/useTranslate';
import { toast } from '@/lib/sonner';

/**
 * PHQ-2 assessment modal.
 * Persists answers via POST /assessments/phq-2.
 */
const Phq2AssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { submit } = useSubmitPhq2Assessment();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(
    async (payload: SubmitPhq2Assessment) => {
      await submit(payload);
      toast.success(t('phq2_save_success_title'), {
        description: t('phq2_save_success_description'),
      });
      router.back();
    },
    [router, submit, t],
  );

  return <Phq2Wizard onClose={handleClose} onSave={handleSave} />;
};

export default Phq2AssessmentScreen;
