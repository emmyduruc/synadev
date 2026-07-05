export const HEALTH_METRIC_KEY = {
  steps: 'steps',
  heartRate: 'heart_rate',
  restingHeartRate: 'resting_heart_rate',
  hrvSdnn: 'hrv_sdnn',
  hrvRmssd: 'hrv_rmssd',
  respiratoryRate: 'respiratory_rate',
  oxygenSaturation: 'oxygen_saturation',
  wristTemperature: 'wrist_temperature',
  bodyTemperature: 'body_temperature',
  activeEnergy: 'active_energy',
  activeCalories: 'active_calories',
  exerciseMinutes: 'exercise_minutes',
  sleepAnalysis: 'sleep_analysis',
  sleepSessions: 'sleep_sessions',
} as const;

export type HealthMetricKey = (typeof HEALTH_METRIC_KEY)[keyof typeof HEALTH_METRIC_KEY];

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

export const isHealthMetricKey = (value: string): value is HealthMetricKey =>
  value in HEALTH_METRIC_LABEL_KEY;
