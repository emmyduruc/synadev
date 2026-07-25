import {
  HEALTH_METRIC_KEY,
  isHealthMetricKey,
  type HealthMetricKey,
} from '@syna/shared-types';

export { HEALTH_METRIC_KEY, isHealthMetricKey };
export type { HealthMetricKey };

export const HEALTH_METRIC_LABEL_KEY: Record<HealthMetricKey, string> = {
  [HEALTH_METRIC_KEY.steps]: 'health_metric_steps',
  [HEALTH_METRIC_KEY.heartRate]: 'health_metric_heart_rate',
  [HEALTH_METRIC_KEY.restingHeartRate]: 'health_metric_resting_heart_rate',
  [HEALTH_METRIC_KEY.hrvSdnn]: 'health_metric_hrv',
  [HEALTH_METRIC_KEY.hrvRmssd]: 'health_metric_hrv',
  [HEALTH_METRIC_KEY.respiratoryRate]: 'health_metric_respiratory_rate',
  [HEALTH_METRIC_KEY.oxygenSaturation]: 'health_metric_oxygen_saturation',
  [HEALTH_METRIC_KEY.wristTemperature]: 'health_metric_wrist_temperature',
  [HEALTH_METRIC_KEY.bodyTemperature]: 'health_metric_body_temperature',
  [HEALTH_METRIC_KEY.activeEnergy]: 'health_metric_active_energy',
  [HEALTH_METRIC_KEY.activeCalories]: 'health_metric_active_calories',
  [HEALTH_METRIC_KEY.exerciseMinutes]: 'health_metric_exercise_minutes',
  [HEALTH_METRIC_KEY.sleepAnalysis]: 'health_metric_sleep',
  [HEALTH_METRIC_KEY.sleepSessions]: 'health_metric_sleep',
};
