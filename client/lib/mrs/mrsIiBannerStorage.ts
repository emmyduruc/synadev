import * as SecureStore from 'expo-secure-store';

const MRS_II_BANNER_DISMISSED_KEY = 'mrs_ii_banner_dismissed';
const MRS_II_COMPLETED_KEY = 'mrs_ii_assessment_completed';

export const getMrsIiBannerDismissed = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(MRS_II_BANNER_DISMISSED_KEY);
  return value === 'true';
};

export const setMrsIiBannerDismissed = async (): Promise<void> => {
  await SecureStore.setItemAsync(MRS_II_BANNER_DISMISSED_KEY, 'true');
};

export const getMrsIiAssessmentCompleted = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(MRS_II_COMPLETED_KEY);
  return value === 'true';
};

export const setMrsIiAssessmentCompleted = async (): Promise<void> => {
  await SecureStore.setItemAsync(MRS_II_COMPLETED_KEY, 'true');
};
