import {
  DEEPENING_FIELD_INPUT,
  DEEPENING_FIELDS,
  MIGRAINE_AURA_LABEL_KEYS,
  MIGRAINE_DIAGNOSIS_LABEL_KEYS,
  MIGRAINE_HRT_LABEL_KEYS,
  type DeepeningFieldId,
} from '@/lib/deepening/deepeningCatalog';
import {
  isDeepeningFieldCompleted,
  type DeepeningFieldValue,
} from '@/lib/deepening/deepeningTypes';

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

export const formatDeepeningFieldSummary = (
  fieldId: DeepeningFieldId,
  value: DeepeningFieldValue,
  t: TranslateFn,
): string | undefined => {
  if (!isDeepeningFieldCompleted(value)) {
    return undefined;
  }

  const field = DEEPENING_FIELDS[fieldId];

  if (
    value.kind === DEEPENING_FIELD_INPUT.singleSelect
    && value.option
    && field.labelKeyByOption
  ) {
    return t(field.labelKeyByOption[value.option]);
  }

  if (value.kind === DEEPENING_FIELD_INPUT.text) {
    return value.text.trim();
  }

  if (value.kind === DEEPENING_FIELD_INPUT.number) {
    return t('deepening_physical_activity_summary', { minutes: value.amount });
  }

  if (value.kind === DEEPENING_FIELD_INPUT.bloodPressure) {
    return t('deepening_bp_summary', {
      systolic: value.bloodPressure.systolic,
      diastolic: value.bloodPressure.diastolic,
    });
  }

  if (value.kind !== DEEPENING_FIELD_INPUT.migraine) {
    return undefined;
  }

  const parts: string[] = [];

  if (value.migraine.diagnosis) {
    parts.push(t(MIGRAINE_DIAGNOSIS_LABEL_KEYS[value.migraine.diagnosis]));
  }

  if (value.migraine.aura) {
    parts.push(t(MIGRAINE_AURA_LABEL_KEYS[value.migraine.aura]));
  }

  if (value.migraine.daysPerMonth > 0) {
    parts.push(
      t('deepening_migraine_days_value', { count: value.migraine.daysPerMonth }),
    );
  }

  if (value.migraine.hrtStatus) {
    parts.push(t(MIGRAINE_HRT_LABEL_KEYS[value.migraine.hrtStatus]));
  }

  return parts.length > 0 ? parts.join(' · ') : undefined;
};
