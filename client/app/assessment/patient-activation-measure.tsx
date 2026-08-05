import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { PatientActivationMeasureWizard } from '@/components/patientActivationMeasure/PatientActivationMeasureWizard';
import { useSubmitPam13Assessment } from '@/hooks/useSubmitPam13Assessment';
import { useTranslate } from '@/hooks/useTranslate';
import type { PatientActivationMeasureSubmissionPayload } from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';
import { toast } from '@/lib/sonner';

/**
 * Patient Activation Measure assessment modal.
 * Persists answers via POST /assessments/pam-13.
 */
const PatientActivationMeasureAssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { submit } = useSubmitPam13Assessment();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(
    async (payload: PatientActivationMeasureSubmissionPayload) => {
      await submit(payload);
      toast.success(t('patient_activation_measure_save_success_title'), {
        description: t('patient_activation_measure_save_success_description'),
      });
      router.back();
    },
    [router, submit, t],
  );

  return (
    <PatientActivationMeasureWizard onClose={handleClose} onSave={handleSave} />
  );
};

export default PatientActivationMeasureAssessmentScreen;
