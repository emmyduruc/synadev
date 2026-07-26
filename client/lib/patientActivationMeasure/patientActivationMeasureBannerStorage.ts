import * as SecureStore from 'expo-secure-store';

const BANNER_DISMISSED_KEY = 'patient_activation_measure_banner_dismissed';
const COMPLETED_KEY = 'patient_activation_measure_assessment_completed';

export const getPatientActivationMeasureBannerDismissed = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(BANNER_DISMISSED_KEY);
  return value === 'true';
};

export const setPatientActivationMeasureBannerDismissed = async (): Promise<void> => {
  await SecureStore.setItemAsync(BANNER_DISMISSED_KEY, 'true');
};

export const getPatientActivationMeasureAssessmentCompleted = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(COMPLETED_KEY);
  return value === 'true';
};

export const setPatientActivationMeasureAssessmentCompleted = async (): Promise<void> => {
  await SecureStore.setItemAsync(COMPLETED_KEY, 'true');
};
