import { useCallback } from 'react';

import { submitPam13Assessment } from '@/lib/api';
import { setPatientActivationMeasureAssessmentCompleted } from '@/lib/patientActivationMeasure/patientActivationMeasureBannerStorage';
import type { PatientActivationMeasureSubmissionPayload } from '@/lib/patientActivationMeasure/patientActivationMeasureTypes';

export const useSubmitPam13Assessment = () => {
  const submit = useCallback(async (payload: PatientActivationMeasureSubmissionPayload) => {
    const submission = await submitPam13Assessment({
      assessmentId: payload.assessmentId,
      timepoint: payload.timepoint,
      answers: payload.answers,
    });
    await setPatientActivationMeasureAssessmentCompleted();
    return submission;
  }, []);

  return { submit };
};
