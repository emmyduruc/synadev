import type { PatientActivationMeasureItemId } from './patientActivationMeasureTypes';

export type PatientActivationMeasureItem = {
  id: PatientActivationMeasureItemId;
  /** 1-based instrument order (fixed). */
  index: number;
  titleKey: string;
};

export const PATIENT_ACTIVATION_MEASURE_ITEM_COUNT = 13;

/** Fixed instrument order. Do not reorder. */
export const PATIENT_ACTIVATION_MEASURE_ITEMS: readonly PatientActivationMeasureItem[] = [
  {
    id: 'active_role',
    index: 1,
    titleKey: 'patient_activation_measure_item_active_role',
  },
  {
    id: 'active_role_priority',
    index: 2,
    titleKey: 'patient_activation_measure_item_active_role_priority',
  },
  {
    id: 'know_medications',
    index: 3,
    titleKey: 'patient_activation_measure_item_know_medications',
  },
  {
    id: 'discuss_treatment',
    index: 4,
    titleKey: 'patient_activation_measure_item_discuss_treatment',
  },
  {
    id: 'recognize_changes',
    index: 5,
    titleKey: 'patient_activation_measure_item_recognize_changes',
  },
  {
    id: 'find_solutions',
    index: 6,
    titleKey: 'patient_activation_measure_item_find_solutions',
  },
  {
    id: 'know_exercise',
    index: 7,
    titleKey: 'patient_activation_measure_item_know_exercise',
  },
  {
    id: 'ask_doctor',
    index: 8,
    titleKey: 'patient_activation_measure_item_ask_doctor',
  },
  {
    id: 'protect_health',
    index: 9,
    titleKey: 'patient_activation_measure_item_protect_health',
  },
  {
    id: 'avoid_unhealthy',
    index: 10,
    titleKey: 'patient_activation_measure_item_avoid_unhealthy',
  },
  {
    id: 'recognize_illness_signs',
    index: 11,
    titleKey: 'patient_activation_measure_item_recognize_illness_signs',
  },
  {
    id: 'take_action',
    index: 12,
    titleKey: 'patient_activation_measure_item_take_action',
  },
  {
    id: 'responsible_for_health',
    index: 13,
    titleKey: 'patient_activation_measure_item_responsible_for_health',
  },
] as const;

export const PATIENT_ACTIVATION_MEASURE_RESPONSE_LABEL_KEYS = {
  1: 'patient_activation_measure_response_completely_disagree',
  2: 'patient_activation_measure_response_rather_disagree',
  3: 'patient_activation_measure_response_tend_to_agree',
  4: 'patient_activation_measure_response_completely_agree',
} as const;

export const createEmptyPatientActivationMeasureAnswers = (): Record<
  PatientActivationMeasureItemId,
  null
> => ({
  active_role: null,
  active_role_priority: null,
  know_medications: null,
  discuss_treatment: null,
  recognize_changes: null,
  find_solutions: null,
  know_exercise: null,
  ask_doctor: null,
  protect_health: null,
  avoid_unhealthy: null,
  recognize_illness_signs: null,
  take_action: null,
  responsible_for_health: null,
});
