import * as SecureStore from 'expo-secure-store';

import {
  DEEPENING_FIELD,
  DEEPENING_FIELD_INPUT,
  type DeepeningFieldId,
} from '@/lib/deepening/deepeningCatalog';
import {
  createEmptyDeepeningEntries,
  EMPTY_BLOOD_PRESSURE_VALUE,
  EMPTY_MIGRAINE_VALUE,
  type DeepeningEntries,
  type DeepeningFieldValue,
} from '@/lib/deepening/deepeningTypes';

const DEEPENING_STORAGE_KEY = 'profile_deepening_entries_v1';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseFieldValue = (
  fieldId: DeepeningFieldId,
  raw: unknown,
): DeepeningFieldValue => {
  const empty = createEmptyDeepeningEntries()[fieldId];

  if (!isRecord(raw) || typeof raw.kind !== 'string') {
    return empty;
  }

  if (raw.kind === DEEPENING_FIELD_INPUT.singleSelect) {
    return {
      kind: DEEPENING_FIELD_INPUT.singleSelect,
      option: typeof raw.option === 'string' ? raw.option : null,
    };
  }

  if (raw.kind === DEEPENING_FIELD_INPUT.text) {
    return {
      kind: DEEPENING_FIELD_INPUT.text,
      text: typeof raw.text === 'string' ? raw.text : '',
    };
  }

  if (raw.kind === DEEPENING_FIELD_INPUT.number) {
    return {
      kind: DEEPENING_FIELD_INPUT.number,
      amount: typeof raw.amount === 'string' ? raw.amount : '',
    };
  }

  if (raw.kind === DEEPENING_FIELD_INPUT.bloodPressure && isRecord(raw.bloodPressure)) {
    return {
      kind: DEEPENING_FIELD_INPUT.bloodPressure,
      bloodPressure: {
        systolic:
          typeof raw.bloodPressure.systolic === 'string'
            ? raw.bloodPressure.systolic
            : '',
        diastolic:
          typeof raw.bloodPressure.diastolic === 'string'
            ? raw.bloodPressure.diastolic
            : '',
      },
    };
  }

  if (raw.kind === DEEPENING_FIELD_INPUT.migraine && isRecord(raw.migraine)) {
    return {
      kind: DEEPENING_FIELD_INPUT.migraine,
      migraine: {
        diagnosis:
          typeof raw.migraine.diagnosis === 'string'
            ? (raw.migraine.diagnosis as typeof EMPTY_MIGRAINE_VALUE.diagnosis)
            : null,
        aura:
          typeof raw.migraine.aura === 'string'
            ? (raw.migraine.aura as typeof EMPTY_MIGRAINE_VALUE.aura)
            : null,
        daysPerMonth:
          typeof raw.migraine.daysPerMonth === 'number'
            ? raw.migraine.daysPerMonth
            : 0,
        medication:
          typeof raw.migraine.medication === 'string'
            ? raw.migraine.medication
            : '',
        hrtStatus:
          typeof raw.migraine.hrtStatus === 'string'
            ? (raw.migraine.hrtStatus as typeof EMPTY_MIGRAINE_VALUE.hrtStatus)
            : null,
      },
    };
  }

  return empty;
};

export const loadDeepeningEntries = async (): Promise<DeepeningEntries> => {
  const raw = await SecureStore.getItemAsync(DEEPENING_STORAGE_KEY);

  if (!raw) {
    return createEmptyDeepeningEntries();
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed)) {
      return createEmptyDeepeningEntries();
    }

    const next = createEmptyDeepeningEntries();

    for (const fieldId of Object.values(DEEPENING_FIELD)) {
      next[fieldId] = parseFieldValue(fieldId, parsed[fieldId]);
    }

    return next;
  } catch {
    return createEmptyDeepeningEntries();
  }
};

export const saveDeepeningEntries = async (
  entries: DeepeningEntries,
): Promise<void> => {
  await SecureStore.setItemAsync(DEEPENING_STORAGE_KEY, JSON.stringify(entries));
};

export { EMPTY_BLOOD_PRESSURE_VALUE, EMPTY_MIGRAINE_VALUE };
