import type { HealthRecordMedication, UserHealthRecord } from '@syna/shared-types';
import { createEmptyUserHealthRecord } from '@syna/shared-types';

export const createHealthRecordMedicationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const resolveHealthRecord = (
  value: UserHealthRecord | null | undefined,
): UserHealthRecord => {
  if (value) {
    return value;
  }

  return createEmptyUserHealthRecord();
};

export const createEmptyMedicationDraft = (): HealthRecordMedication => ({
  id: createHealthRecordMedicationId(),
  name: '',
  dose: null,
  startedAt: null,
  notes: null,
});

export const formatLabsSummary = (
  record: UserHealthRecord,
  emptyLabel: string,
): string => {
  const labs = record.labs;

  if (!labs) {
    return emptyLabel;
  }

  const parts: string[] = [];

  if (labs.fsh !== null && labs.fsh !== undefined) {
    parts.push(`FSH ${labs.fsh}`);
  }

  if (labs.estradiol !== null && labs.estradiol !== undefined) {
    parts.push(`E2 ${labs.estradiol}`);
  }

  if (labs.drawnAt) {
    parts.push(labs.drawnAt);
  }

  return parts.length > 0 ? parts.join(' · ') : emptyLabel;
};

export const formatMedicationSummary = (
  medication: HealthRecordMedication,
): string => {
  if (medication.dose) {
    return `${medication.name} (${medication.dose})`;
  }

  return medication.name;
};

export const formatConcernsSummary = (
  concerns: string | null,
  emptyLabel: string,
): string => {
  const trimmed = concerns?.trim() ?? '';

  if (!trimmed) {
    return emptyLabel;
  }

  if (trimmed.length <= 80) {
    return trimmed;
  }

  return `${trimmed.slice(0, 77)}...`;
};
