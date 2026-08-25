import { PATTERN_CHART_METRIC, PATTERN_CHART_TYPE } from '@/lib/patterns/patternChartConstants';
import type {
  BuildDoctorReportInput,
  DoctorReportChartBlock,
  DoctorReportClinicalRow,
  DoctorReportNarrativeBlock,
  DoctorReportScoreRow,
  DoctorReportSection,
  DoctorReportViewModel,
} from '@/lib/report/doctorReportTypes';
import {
  DOCTOR_REPORT_WINDOW_DAYS,
  HEAT_SYMPTOM_IDS,
  REPORT_MIN_TRACKED_DAYS,
} from '@/lib/report/reportConstants';

const HEAT_SET = new Set<string>(HEAT_SYMPTOM_IDS);

const SLEEP_REFERENCE_HOURS = 6;

const computeAgeYears = (dateOfBirth: string | null): number | null => {
  if (!dateOfBirth?.trim()) {
    return null;
  }

  const parts = dateOfBirth.split('-').map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const birth = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 && age <= 120 ? age : null;
};

const countTrackedDays = (input: BuildDoctorReportInput): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const symptoms = input.symptomsByDate.get(dateKey) ?? [];
    const mood = input.moodsByDate.get(dateKey);
    const health = input.healthByDate.get(dateKey);
    const hasSymptom = symptoms.length > 0;
    const hasMood =
      mood !== undefined && (mood.energy !== null || mood.stress !== null);
    const hasHealth =
      health !== undefined &&
      (health.sleepHours !== null ||
        health.steps !== null ||
        health.hrvMs !== null ||
        health.nightHr !== null ||
        health.deepSleepHours !== null);

    if (hasSymptom || hasMood || hasHealth) {
      count += 1;
    }
  }

  return count;
};

const countHeatDays = (input: BuildDoctorReportInput): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const symptoms = input.symptomsByDate.get(dateKey) ?? [];

    if (symptoms.some((id) => HEAT_SET.has(id))) {
      count += 1;
    }
  }

  return count;
};

const averageMetric = (
  input: BuildDoctorReportInput,
  pick: (
    health: NonNullable<ReturnType<BuildDoctorReportInput['healthByDate']['get']>>,
  ) => number | null | undefined,
): number | null => {
  let sum = 0;
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const health = input.healthByDate.get(dateKey);

    if (!health) {
      continue;
    }

    const value = pick(health);

    if (value !== null && value !== undefined && Number.isFinite(value) && value > 0) {
      sum += value;
      count += 1;
    }
  }

  if (count === 0) {
    return null;
  }

  return Math.round((sum / count) * 10) / 10;
};

const averageMoodMetric = (
  input: BuildDoctorReportInput,
  pick: (mood: { energy: number | null; stress: number | null }) => number | null,
): number | null => {
  let sum = 0;
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const mood = input.moodsByDate.get(dateKey);

    if (!mood) {
      continue;
    }

    const value = pick(mood);

    if (value !== null && Number.isFinite(value)) {
      sum += value;
      count += 1;
    }
  }

  if (count === 0) {
    return null;
  }

  return Math.round((sum / count) * 10) / 10;
};

const countSleepNightsUnder = (
  input: BuildDoctorReportInput,
  thresholdHours: number,
): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const hours = input.healthByDate.get(dateKey)?.sleepHours;

    if (hours !== null && hours !== undefined && hours > 0 && hours < thresholdHours) {
      count += 1;
    }
  }

  return count;
};

const seriesForMetric = (
  chartSeries: BuildDoctorReportInput['chartSeries'],
  metricId: (typeof PATTERN_CHART_METRIC)[keyof typeof PATTERN_CHART_METRIC],
  dateKeys: readonly string[],
) => {
  const series = chartSeries.find((item) => item.id === metricId);

  if (!series) {
    return dateKeys.map((dateKey) => ({ dateKey, value: null }));
  }

  const byKey = new Map(series.points.map((point) => [point.dateKey, point.value]));

  return dateKeys.map((dateKey) => ({
    dateKey,
    value: byKey.get(dateKey) ?? null,
  }));
};

const buildChart = (
  id: string,
  metricId: (typeof PATTERN_CHART_METRIC)[keyof typeof PATTERN_CHART_METRIC],
  chartType: (typeof PATTERN_CHART_TYPE)[keyof typeof PATTERN_CHART_TYPE],
  captionKey: string,
  input: BuildDoctorReportInput,
  captionParams?: Record<string, string | number>,
  referenceValue?: number | null,
): DoctorReportChartBlock => ({
  id,
  metricId,
  chartType,
  captionKey,
  captionParams,
  referenceValue,
  points: seriesForMetric(input.chartSeries, metricId, input.dateKeys),
});

const formatOptionalNumber = (value: number | null, suffix = ''): string => {
  if (value === null) {
    return '-';
  }

  return `${value}${suffix}`;
};

const buildScores = (input: BuildDoctorReportInput): readonly DoctorReportScoreRow[] => {
  const rows: DoctorReportScoreRow[] = [];

  if (input.mrsLatest) {
    rows.push({
      id: 'mrs',
      labelKey: 'doctor_report_score_mrs_label',
      value: `${input.mrsLatest.total}/44`,
      detailKey: 'doctor_report_score_mrs_detail',
      detailParams: {
        somatic: input.mrsLatest.subscores.somatic,
        psychological: input.mrsLatest.subscores.psychological,
        urogenital: input.mrsLatest.subscores.urogenital,
      },
    });
  } else {
    rows.push({
      id: 'mrs',
      labelKey: 'doctor_report_score_mrs_label',
      value: '-',
      detailKey: 'doctor_report_score_not_completed',
    });
  }

  if (input.phq2Latest) {
    rows.push({
      id: 'phq2',
      labelKey: 'doctor_report_score_phq2_label',
      value: `${input.phq2Latest.total}/6`,
      detailKey: 'doctor_report_score_phq2_detail',
      detailParams: { total: input.phq2Latest.total },
    });
  } else {
    rows.push({
      id: 'phq2',
      labelKey: 'doctor_report_score_phq2_label',
      value: '-',
      detailKey: 'doctor_report_score_not_completed',
    });
  }

  if (input.pamLatest?.scaledScore !== null && input.pamLatest?.scaledScore !== undefined) {
    rows.push({
      id: 'pam',
      labelKey: 'doctor_report_score_pam_label',
      value: `${Math.round(input.pamLatest.scaledScore)}`,
      detailKey: 'doctor_report_score_pam_detail',
      detailParams: { score: Math.round(input.pamLatest.scaledScore) },
    });
  } else {
    rows.push({
      id: 'pam',
      labelKey: 'doctor_report_score_pam_label',
      value: '-',
      detailKey: 'doctor_report_score_not_completed',
    });
  }

  return rows;
};

const buildClinicalRows = (
  input: BuildDoctorReportInput,
): readonly DoctorReportClinicalRow[] => {
  const labs = input.healthRecord?.labs;
  const rows: DoctorReportClinicalRow[] = [];

  rows.push({
    id: 'fsh',
    labelKey: 'doctor_report_clinical_fsh',
    value: formatOptionalNumber(labs?.fsh ?? null),
  });
  rows.push({
    id: 'estradiol',
    labelKey: 'doctor_report_clinical_estradiol',
    value: formatOptionalNumber(labs?.estradiol ?? null),
  });
  rows.push({
    id: 'labs_drawn',
    labelKey: 'doctor_report_clinical_labs_drawn',
    value: labs?.drawnAt?.trim() ? labs.drawnAt : '-',
  });

  return rows;
};

const paragraph = (
  id: string,
  bodyKey: string,
  params?: Record<string, string | number>,
): DoctorReportNarrativeBlock => ({
  id,
  bodyKey,
  params,
});

const buildSections = (
  input: BuildDoctorReportInput,
  stats: {
    avgSleep: number | null;
    nightsUnder6: number;
    heatDays: number;
    avgNightHr: number | null;
    avgDeepSleep: number | null;
    avgSteps: number | null;
    avgHrv: number | null;
    avgStress: number | null;
    avgEnergy: number | null;
    trackedDays: number;
    windowDays: number;
  },
): readonly DoctorReportSection[] => {
  const sections: DoctorReportSection[] = [];

  sections.push({
    id: 'sleep',
    titleKey: 'doctor_report_section_sleep_title',
    paragraphs: [
      paragraph('sleep_overview', 'doctor_report_section_sleep_body', {
        days: stats.windowDays,
        avgSleep: stats.avgSleep ?? '-',
        nightsUnder6: stats.nightsUnder6,
        avgNightHr: stats.avgNightHr ?? '-',
        avgDeepSleep: stats.avgDeepSleep ?? '-',
      }),
    ],
    charts: [
      buildChart(
        'sleep_chart',
        PATTERN_CHART_METRIC.sleep,
        PATTERN_CHART_TYPE.area,
        'doctor_report_chart_sleep_caption',
        input,
        { avg: stats.avgSleep ?? '-' },
        SLEEP_REFERENCE_HOURS,
      ),
    ],
    showSymptomGrid: false,
  });

  sections.push({
    id: 'vasomotor',
    titleKey: 'doctor_report_section_vasomotor_title',
    paragraphs: [
      paragraph('vasomotor_overview', 'doctor_report_section_vasomotor_body', {
        days: stats.windowDays,
        heatDays: stats.heatDays,
        trackedDays: stats.trackedDays,
      }),
    ],
    charts: [
      buildChart(
        'heat_chart',
        PATTERN_CHART_METRIC.heat,
        PATTERN_CHART_TYPE.bar,
        'doctor_report_chart_heat_caption',
        input,
        { count: stats.heatDays, days: stats.windowDays },
      ),
    ],
    showSymptomGrid: true,
  });

  sections.push({
    id: 'movement',
    titleKey: 'doctor_report_section_movement_title',
    paragraphs: [
      paragraph('movement_overview', 'doctor_report_section_movement_body', {
        avgSteps: stats.avgSteps ?? '-',
        avgHrv: stats.avgHrv ?? '-',
      }),
    ],
    charts: [
      buildChart(
        'steps_chart',
        PATTERN_CHART_METRIC.steps,
        PATTERN_CHART_TYPE.bar,
        'doctor_report_chart_steps_caption',
        input,
        { avg: stats.avgSteps ?? '-' },
      ),
      buildChart(
        'hrv_chart',
        PATTERN_CHART_METRIC.hrv,
        PATTERN_CHART_TYPE.area,
        'doctor_report_chart_hrv_caption',
        input,
        { avg: stats.avgHrv ?? '-' },
      ),
    ],
    showSymptomGrid: false,
  });

  sections.push({
    id: 'mood',
    titleKey: 'doctor_report_section_mood_title',
    paragraphs: [
      paragraph('mood_overview', 'doctor_report_section_mood_body', {
        avgStress: stats.avgStress ?? '-',
        avgEnergy: stats.avgEnergy ?? '-',
      }),
    ],
    charts: [
      buildChart(
        'stress_chart',
        PATTERN_CHART_METRIC.stress,
        PATTERN_CHART_TYPE.area,
        'doctor_report_chart_stress_caption',
        input,
        { avg: stats.avgStress ?? '-' },
      ),
      buildChart(
        'energy_chart',
        PATTERN_CHART_METRIC.energy,
        PATTERN_CHART_TYPE.area,
        'doctor_report_chart_energy_caption',
        input,
        { avg: stats.avgEnergy ?? '-' },
      ),
    ],
    showSymptomGrid: false,
  });

  return sections;
};

/**
 * Deterministic clinician-facing report from logs, wearables, assessments, and health record.
 */
export const buildDoctorReport = (
  input: BuildDoctorReportInput,
): DoctorReportViewModel => {
  const windowDays =
    input.windowDays > 0 ? input.windowDays : DOCTOR_REPORT_WINDOW_DAYS;
  const trackedDays = countTrackedDays(input);
  const heatDays = countHeatDays(input);
  const avgSleep = averageMetric(input, (health) => health.sleepHours);
  const nightsUnder6 = countSleepNightsUnder(input, SLEEP_REFERENCE_HOURS);
  const avgNightHr = averageMetric(input, (health) => health.nightHr);
  const avgDeepSleep = averageMetric(input, (health) => health.deepSleepHours);
  const avgSteps = averageMetric(input, (health) => health.steps);
  const avgHrv = averageMetric(input, (health) => health.hrvMs);
  const avgStress = averageMoodMetric(input, (mood) => mood.stress);
  const avgEnergy = averageMoodMetric(input, (mood) => mood.energy);

  const first = input.firstName?.trim() ?? '';
  const last = input.lastName?.trim() ?? '';
  const patientName = [first, last].filter(Boolean).join(' ') || '-';
  const ageYears = computeAgeYears(input.dateOfBirth);
  const isEmpty = trackedDays < REPORT_MIN_TRACKED_DAYS;

  const windowStartDateKey = input.dateKeys[0] ?? '';
  const windowEndDateKey = input.dateKeys[input.dateKeys.length - 1] ?? '';

  const summaryKey = isEmpty
    ? 'doctor_report_summary_empty'
    : 'doctor_report_summary_ready';
  const summaryParams: Record<string, string | number> = isEmpty
    ? { minDays: REPORT_MIN_TRACKED_DAYS, trackedDays }
    : {
        days: windowDays,
        trackedDays,
        heatDays,
        avgSleep: avgSleep ?? '-',
        mrsTotal: input.mrsLatest?.total ?? '-',
      };

  return {
    patientName,
    ageYears,
    windowDays,
    windowStartDateKey,
    windowEndDateKey,
    trackedDays,
    generatedAtIso: input.generatedAtIso ?? new Date().toISOString(),
    isEmpty,
    summaryKey,
    summaryParams,
    sections: isEmpty ? [] : buildSections(input, {
      avgSleep,
      nightsUnder6,
      heatDays,
      avgNightHr,
      avgDeepSleep,
      avgSteps,
      avgHrv,
      avgStress,
      avgEnergy,
      trackedDays,
      windowDays,
    }),
    scores: buildScores(input),
    clinicalRows: buildClinicalRows(input),
    medications: input.healthRecord?.medications ?? [],
    concerns: input.healthRecord?.concerns?.trim()
      ? input.healthRecord.concerns.trim()
      : null,
    heatmap: input.heatmap,
    chartSeries: input.chartSeries,
    computation: input.computation,
    mrsLatest: input.mrsLatest,
    pamLatest: input.pamLatest,
    phq2Latest: input.phq2Latest,
    healthRecord: input.healthRecord,
  };
};
