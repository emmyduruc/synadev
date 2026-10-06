import { addDaysToKey } from '@/lib/date/dateKeys';
import {
  buildDefaultReportRange,
  countInclusiveDays,
  type ReportDateRange,
  type ReportDateRangeBounds,
} from '@/lib/report/reportDateRange';

export const REPORT_PERIOD_PRESET = {
  days14: 'days_14',
  days28: 'days_28',
  days90: 'days_90',
  sinceStart: 'since_start',
  custom: 'custom',
} as const;

export type ReportPeriodPresetId =
  (typeof REPORT_PERIOD_PRESET)[keyof typeof REPORT_PERIOD_PRESET];

export type ReportPeriodPresetOptionId = Exclude<
  ReportPeriodPresetId,
  typeof REPORT_PERIOD_PRESET.custom
>;

export const REPORT_PERIOD_PRESET_OPTIONS: readonly {
  id: ReportPeriodPresetOptionId;
  days: number | null;
  titleKey: string;
  descriptionKey: string;
}[] = [
  {
    id: REPORT_PERIOD_PRESET.days14,
    days: 14,
    titleKey: 'report_period_preset_14_title',
    descriptionKey: 'report_period_preset_14_description',
  },
  {
    id: REPORT_PERIOD_PRESET.days28,
    days: 28,
    titleKey: 'report_period_preset_28_title',
    descriptionKey: 'report_period_preset_28_description',
  },
  {
    id: REPORT_PERIOD_PRESET.days90,
    days: 90,
    titleKey: 'report_period_preset_90_title',
    descriptionKey: 'report_period_preset_90_description',
  },
  {
    id: REPORT_PERIOD_PRESET.sinceStart,
    days: null,
    titleKey: 'report_period_preset_since_start_title',
    descriptionKey: 'report_period_preset_since_start_description',
  },
] as const;

export const buildRangeForPreset = (
  presetId: ReportPeriodPresetOptionId,
  bounds: ReportDateRangeBounds,
): ReportDateRange => {
  if (presetId === REPORT_PERIOD_PRESET.sinceStart) {
    return {
      fromDateKey: bounds.minDateKey,
      toDateKey: bounds.maxDateKey,
    };
  }

  const option = REPORT_PERIOD_PRESET_OPTIONS.find((item) => item.id === presetId);
  const windowDays = option?.days ?? 28;

  return buildDefaultReportRange(bounds, windowDays);
};

export const resolvePresetFromRange = (
  range: ReportDateRange,
  bounds: ReportDateRangeBounds,
): ReportPeriodPresetId => {
  if (range.fromDateKey === bounds.minDateKey && range.toDateKey === bounds.maxDateKey) {
    return REPORT_PERIOD_PRESET.sinceStart;
  }

  const days = countInclusiveDays(range.fromDateKey, range.toDateKey);
  const expectedFrom = addDaysToKey(range.toDateKey, -(days - 1));

  if (range.fromDateKey !== expectedFrom || range.toDateKey !== bounds.maxDateKey) {
    return REPORT_PERIOD_PRESET.custom;
  }

  if (days === 14) {
    return REPORT_PERIOD_PRESET.days14;
  }

  if (days === 28) {
    return REPORT_PERIOD_PRESET.days28;
  }

  if (days === 90) {
    return REPORT_PERIOD_PRESET.days90;
  }

  return REPORT_PERIOD_PRESET.custom;
};
