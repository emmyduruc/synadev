import type {
  HealthRecordMedication,
  MrsIiAssessmentSubmission,
  Pam13AssessmentSubmission,
  Phq2AssessmentSubmission,
  UserHealthRecord,
} from '@syna/shared-types';
import type { PatternHeatmapResult, PatternsComputation } from '@syna/shared-utils';

import type { PatternChartPoint, PatternChartSeries } from '@/lib/patterns/buildPatternChartSeries';
import type {
  PatternChartMetricId,
  PatternChartType,
} from '@/lib/patterns/patternChartConstants';

export type DoctorReportNarrativeBlock = {
  id: string;
  bodyKey: string;
  params?: Record<string, string | number>;
};

export type DoctorReportChartBlock = {
  id: string;
  metricId: PatternChartMetricId;
  chartType: PatternChartType;
  points: readonly PatternChartPoint[];
  captionKey: string;
  captionParams?: Record<string, string | number>;
  referenceValue?: number | null;
};

export type DoctorReportSection = {
  id: string;
  titleKey: string;
  paragraphs: readonly DoctorReportNarrativeBlock[];
  charts: readonly DoctorReportChartBlock[];
  showSymptomGrid: boolean;
};

export type DoctorReportScoreRow = {
  id: string;
  labelKey: string;
  value: string;
  detailKey?: string;
  detailParams?: Record<string, string | number>;
};

export type DoctorReportClinicalRow = {
  id: string;
  labelKey: string;
  value: string;
};

export type DoctorReportViewModel = {
  patientName: string;
  ageYears: number | null;
  windowDays: number;
  windowStartDateKey: string;
  windowEndDateKey: string;
  trackedDays: number;
  generatedAtIso: string;
  isEmpty: boolean;
  summaryKey: string;
  summaryParams: Record<string, string | number>;
  sections: readonly DoctorReportSection[];
  scores: readonly DoctorReportScoreRow[];
  clinicalRows: readonly DoctorReportClinicalRow[];
  medications: readonly HealthRecordMedication[];
  concerns: string | null;
  heatmap: PatternHeatmapResult | null;
  chartSeries: readonly PatternChartSeries[];
  computation: PatternsComputation | null;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
  phq2Latest: Phq2AssessmentSubmission | null;
  healthRecord: UserHealthRecord | null;
};

export type BuildDoctorReportInput = {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  windowDays: number;
  dateKeys: readonly string[];
  symptomsByDate: ReadonlyMap<string, readonly string[]>;
  moodsByDate: ReadonlyMap<
    string,
    { energy: number | null; stress: number | null }
  >;
  healthByDate: ReadonlyMap<
    string,
    {
      sleepHours: number | null;
      steps: number | null;
      hrvMs: number | null;
      nightHr: number | null;
      deepSleepHours: number | null;
      exerciseMinutes: number | null;
    }
  >;
  computation: PatternsComputation | null;
  chartSeries: readonly PatternChartSeries[];
  heatmap: PatternHeatmapResult | null;
  mrsLatest: MrsIiAssessmentSubmission | null;
  pamLatest: Pam13AssessmentSubmission | null;
  phq2Latest: Phq2AssessmentSubmission | null;
  healthRecord: UserHealthRecord | null;
  generatedAtIso?: string;
};
