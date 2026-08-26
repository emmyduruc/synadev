import {
  ASSESSMENT_TIMEPOINT,
  ASSESSMENT_TIMEPOINTS,
  MRS_II_ASSESSMENT_ID,
  MRS_II_ASSESSMENT_IDS,
  MRS_II_ITEM_COUNT,
  MRS_II_ITEM_KEYS,
  MrsIiLatestSchema,
  type MrsIiAssessmentSubmission,
  type MrsIiLatest,
  type MrsIiSeverityValue,
} from '@syna/shared-types';

const MRS_FALLBACK_SUBMISSION_ID = '00000000-0000-4000-8000-000000000001';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toSeverity = (value: unknown): MrsIiSeverityValue => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(4, Math.max(0, Math.round(value))) as MrsIiSeverityValue;
};

const normalizeAnswers = (value: unknown): MrsIiSeverityValue[] => {
  if (!Array.isArray(value)) {
    return MRS_II_ITEM_KEYS.map(() => 0);
  }

  if (value.length === MRS_II_ITEM_COUNT) {
    return value.map(toSeverity);
  }

  const padded = value.slice(0, MRS_II_ITEM_COUNT).map(toSeverity);

  while (padded.length < MRS_II_ITEM_COUNT) {
    padded.push(0);
  }

  return padded;
};

const normalizeAssessmentId = (value: unknown): (typeof MRS_II_ASSESSMENT_IDS)[number] => {
  if (
    typeof value === 'string' &&
    (MRS_II_ASSESSMENT_IDS as readonly string[]).includes(value)
  ) {
    return value as (typeof MRS_II_ASSESSMENT_IDS)[number];
  }

  return MRS_II_ASSESSMENT_ID.baseline;
};

const normalizeTimepoint = (
  value: unknown,
): MrsIiAssessmentSubmission['timepoint'] => {
  if (
    typeof value === 'string' &&
    (ASSESSMENT_TIMEPOINTS as readonly string[]).includes(value)
  ) {
    return value as MrsIiAssessmentSubmission['timepoint'];
  }

  return ASSESSMENT_TIMEPOINT.t0;
};

const normalizeCompletedAt = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
};

const salvageMrsIiLatest = (data: unknown): MrsIiLatest | null => {
  if (!isRecord(data)) {
    return null;
  }

  const rawSubmission = data.submission;

  if (rawSubmission === null) {
    return { submission: null };
  }

  if (!isRecord(rawSubmission)) {
    return null;
  }

  const rawSubscores = rawSubmission.subscores;
  const total = rawSubmission.total;

  if (typeof total !== 'number' || !Number.isFinite(total) || !isRecord(rawSubscores)) {
    return null;
  }

  const somatic = rawSubscores.somatic;
  const psychological = rawSubscores.psychological;
  const urogenital = rawSubscores.urogenital;

  if (
    typeof somatic !== 'number' ||
    typeof psychological !== 'number' ||
    typeof urogenital !== 'number'
  ) {
    return null;
  }

  const salvaged = {
    submission: {
      id:
        typeof rawSubmission.id === 'string'
          ? rawSubmission.id
          : MRS_FALLBACK_SUBMISSION_ID,
      assessmentId: normalizeAssessmentId(rawSubmission.assessmentId),
      timepoint: normalizeTimepoint(rawSubmission.timepoint),
      answers: normalizeAnswers(rawSubmission.answers),
      total: Math.min(44, Math.max(0, Math.round(total))),
      subscores: {
        somatic: Math.round(somatic),
        psychological: Math.round(psychological),
        urogenital: Math.round(urogenital),
      },
      completedAt: normalizeCompletedAt(rawSubmission.completedAt),
    },
  };

  const parsed = MrsIiLatestSchema.safeParse(salvaged);

  return parsed.success ? parsed.data : null;
};

/** Parse GET /assessments/mrs-ii/latest even when legacy rows fail strict Zod. */
export const parseMrsIiLatest = (data: unknown): MrsIiLatest => {
  const strict = MrsIiLatestSchema.safeParse(data);

  if (strict.success) {
    return strict.data;
  }

  const salvaged = salvageMrsIiLatest(data);

  if (salvaged) {
    return salvaged;
  }

  return MrsIiLatestSchema.parse(data);
};
