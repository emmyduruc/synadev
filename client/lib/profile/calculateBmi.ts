/** BMI from height (cm) and weight (kg), or null if inputs are invalid. */
export const calculateBmi = (
  heightCm: string,
  weightKg: string,
): number | null => {
  const height = Number.parseFloat(heightCm.replace(',', '.'));
  const weight = Number.parseFloat(weightKg.replace(',', '.'));

  if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
    return null;
  }

  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);

  if (!Number.isFinite(bmi) || bmi <= 0) {
    return null;
  }

  return Math.round(bmi * 10) / 10;
};

export const formatBmiDisplay = (bmi: number | null, emptyValue: string): string => {
  if (bmi === null) {
    return emptyValue;
  }

  return String(bmi);
};
