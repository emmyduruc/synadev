import {
  DEEPENING_FIELD,
  DEEPENING_FIELD_INPUT,
  type DeepeningFieldId,
  type MIGRAINE_AURA_OPTIONS,
  type MIGRAINE_DIAGNOSIS_OPTIONS,
  type MIGRAINE_HRT_OPTIONS,
} from '@/lib/deepening/deepeningCatalog';

export type DeepeningMigraineDiagnosis =
  (typeof MIGRAINE_DIAGNOSIS_OPTIONS)[number];
export type DeepeningMigraineAura = (typeof MIGRAINE_AURA_OPTIONS)[number];
export type DeepeningMigraineHrt = (typeof MIGRAINE_HRT_OPTIONS)[number];

export type DeepeningMigraineValue = {
  diagnosis: DeepeningMigraineDiagnosis | null;
  aura: DeepeningMigraineAura | null;
  daysPerMonth: number;
  medication: string;
  hrtStatus: DeepeningMigraineHrt | null;
};

export type DeepeningBloodPressureValue = {
  systolic: string;
  diastolic: string;
};

export type DeepeningFieldValue =
  | { kind: typeof DEEPENING_FIELD_INPUT.singleSelect; option: string | null }
  | { kind: typeof DEEPENING_FIELD_INPUT.text; text: string }
  | { kind: typeof DEEPENING_FIELD_INPUT.number; amount: string }
  | {
      kind: typeof DEEPENING_FIELD_INPUT.bloodPressure;
      bloodPressure: DeepeningBloodPressureValue;
    }
  | {
      kind: typeof DEEPENING_FIELD_INPUT.migraine;
      migraine: DeepeningMigraineValue;
    };

export type DeepeningEntries = Record<DeepeningFieldId, DeepeningFieldValue>;

export const EMPTY_MIGRAINE_VALUE: DeepeningMigraineValue = {
  diagnosis: null,
  aura: null,
  daysPerMonth: 0,
  medication: '',
  hrtStatus: null,
};

export const EMPTY_BLOOD_PRESSURE_VALUE: DeepeningBloodPressureValue = {
  systolic: '',
  diastolic: '',
};

export const createEmptyDeepeningEntries = (): DeepeningEntries => ({
  [DEEPENING_FIELD.vmsFrequency]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.psychologicalStress]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.sleepQuality]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.endometriosis]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.cycleDetails]: { kind: DEEPENING_FIELD_INPUT.text, text: '' },
  [DEEPENING_FIELD.type2Diabetes]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.autoimmune]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.nafld]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.ckd]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.alcohol]: {
    kind: DEEPENING_FIELD_INPUT.singleSelect,
    option: null,
  },
  [DEEPENING_FIELD.nutrition]: { kind: DEEPENING_FIELD_INPUT.text, text: '' },
  [DEEPENING_FIELD.physicalActivity]: {
    kind: DEEPENING_FIELD_INPUT.number,
    amount: '',
  },
  [DEEPENING_FIELD.bloodPressure]: {
    kind: DEEPENING_FIELD_INPUT.bloodPressure,
    bloodPressure: { ...EMPTY_BLOOD_PRESSURE_VALUE },
  },
  [DEEPENING_FIELD.migraine]: {
    kind: DEEPENING_FIELD_INPUT.migraine,
    migraine: { ...EMPTY_MIGRAINE_VALUE },
  },
});

export const isDeepeningFieldCompleted = (value: DeepeningFieldValue): boolean => {
  if (value.kind === DEEPENING_FIELD_INPUT.singleSelect) {
    return value.option !== null;
  }

  if (value.kind === DEEPENING_FIELD_INPUT.text) {
    return value.text.trim().length > 0;
  }

  if (value.kind === DEEPENING_FIELD_INPUT.number) {
    return value.amount.trim().length > 0;
  }

  if (value.kind === DEEPENING_FIELD_INPUT.bloodPressure) {
    return (
      value.bloodPressure.systolic.trim().length > 0
      && value.bloodPressure.diastolic.trim().length > 0
    );
  }

  return (
    value.migraine.diagnosis !== null
    || value.migraine.aura !== null
    || value.migraine.hrtStatus !== null
    || value.migraine.medication.trim().length > 0
    || value.migraine.daysPerMonth > 0
  );
};

export const countCompletedDeepeningEntries = (entries: DeepeningEntries): number =>
  Object.values(entries).filter(isDeepeningFieldCompleted).length;
