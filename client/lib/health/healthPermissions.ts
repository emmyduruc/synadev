export const HEALTH_PERMISSION = {
  sleep: 'sleep',
  activity: 'activity',
  heartRate: 'heart_rate',
  breathing: 'breathing',
  bodyTemperature: 'body_temperature',
} as const;

export type HealthPermissionId =
  (typeof HEALTH_PERMISSION)[keyof typeof HEALTH_PERMISSION];

export const HEALTH_PERMISSION_IDS: readonly HealthPermissionId[] = [
  HEALTH_PERMISSION.sleep,
  HEALTH_PERMISSION.activity,
  HEALTH_PERMISSION.heartRate,
  HEALTH_PERMISSION.breathing,
  HEALTH_PERMISSION.bodyTemperature,
];

export const HEALTH_PERMISSION_LABEL_KEY: Record<HealthPermissionId, string> = {
  [HEALTH_PERMISSION.sleep]: 'health_permission_sleep_label',
  [HEALTH_PERMISSION.activity]: 'health_permission_activity_label',
  [HEALTH_PERMISSION.heartRate]: 'health_permission_heart_rate_label',
  [HEALTH_PERMISSION.breathing]: 'health_permission_breathing_label',
  [HEALTH_PERMISSION.bodyTemperature]: 'health_permission_body_temperature_label',
};
