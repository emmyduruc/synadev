import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { PatientActivationMeasureWizard } from '@/components/patientActivationMeasure/PatientActivationMeasureWizard';
import { useTranslate } from '@/hooks/useTranslate';
import { setPatientActivationMeasureAssessmentCompleted } from '@/lib/patientActivationMeasure/patientActivationMeasureBannerStorage';
import type { PatientActivationMeasureSubmissionPayload } from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';
import { toast } from '@/lib/sonner';

/**
 * Patient Activation Measure assessment modal.
 * UI only; payload is prepared for a future API.
 */
const PatientActivationMeasureAssessmentScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(
    async (_payload: PatientActivationMeasureSubmissionPayload) => {
      await setPatientActivationMeasureAssessmentCompleted();
      toast.success(t('patient_activation_measure_save_success_title'), {
        description: t('patient_activation_measure_save_success_description'),
      });
      router.back();
    },
    [router, t],
  );

  return (
    <PatientActivationMeasureWizard onClose={handleClose} onSave={handleSave} />
  );
};

export default PatientActivationMeasureAssessmentScreen;
