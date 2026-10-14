import { CYCLE_DAY_MARKER, type CycleDayMarker } from '@syna/shared-utils';

/** Circle classes for calendar day cells — keep legend swatches in sync. */
export const CALENDAR_MARKER_CIRCLE_CLASS = {
  period: 'border-2 border-primary-500 bg-primary-500/15',
  predictedPeriod: 'border-2 border-dusty-rose bg-dusty-rose-light',
  ovulation: 'border-2 border-lavender bg-lavender-light',
  fertile: 'border-2 border-sage-mist bg-sage-mist-light',
  today: 'bg-primary-500/15',
  default: 'border border-foreground-muted/30',
  selected: 'bg-primary-500',
} as const;

export const resolveCalendarMarkerCircleClass = (
  isSelected: boolean,
  isToday: boolean,
  marker: CycleDayMarker | null,
): string => {
  if (isSelected) {
    return CALENDAR_MARKER_CIRCLE_CLASS.selected;
  }

  if (marker === CYCLE_DAY_MARKER.period) {
    return CALENDAR_MARKER_CIRCLE_CLASS.period;
  }

  if (marker === CYCLE_DAY_MARKER.predictedPeriod) {
    return CALENDAR_MARKER_CIRCLE_CLASS.predictedPeriod;
  }

  if (marker === CYCLE_DAY_MARKER.ovulation) {
    return CALENDAR_MARKER_CIRCLE_CLASS.ovulation;
  }

  if (marker === CYCLE_DAY_MARKER.fertile) {
    return CALENDAR_MARKER_CIRCLE_CLASS.fertile;
  }

  if (isToday) {
    return CALENDAR_MARKER_CIRCLE_CLASS.today;
  }

  return CALENDAR_MARKER_CIRCLE_CLASS.default;
};

export const CALENDAR_LEGEND_ITEM_ID = {
  period: 'period',
  predictedPeriod: 'predicted_period',
  fertile: 'fertile',
  ovulation: 'ovulation',
  today: 'today',
} as const;

export type CalendarLegendItemId =
  (typeof CALENDAR_LEGEND_ITEM_ID)[keyof typeof CALENDAR_LEGEND_ITEM_ID];

export type CalendarLegendItemConfig = {
  id: CalendarLegendItemId;
  labelKey: string;
  descriptionKey: string;
  marker: CycleDayMarker | null;
  isToday?: boolean;
  circleClass: string;
};

export const CALENDAR_LEGEND_ITEMS: readonly CalendarLegendItemConfig[] = [
  {
    id: CALENDAR_LEGEND_ITEM_ID.period,
    labelKey: 'calendar_legend_period_label',
    descriptionKey: 'calendar_legend_period_description',
    marker: CYCLE_DAY_MARKER.period,
    circleClass: CALENDAR_MARKER_CIRCLE_CLASS.period,
  },
  {
    id: CALENDAR_LEGEND_ITEM_ID.predictedPeriod,
    labelKey: 'calendar_legend_predicted_period_label',
    descriptionKey: 'calendar_legend_predicted_period_description',
    marker: CYCLE_DAY_MARKER.predictedPeriod,
    circleClass: CALENDAR_MARKER_CIRCLE_CLASS.predictedPeriod,
  },
  {
    id: CALENDAR_LEGEND_ITEM_ID.fertile,
    labelKey: 'calendar_legend_fertile_label',
    descriptionKey: 'calendar_legend_fertile_description',
    marker: CYCLE_DAY_MARKER.fertile,
    circleClass: CALENDAR_MARKER_CIRCLE_CLASS.fertile,
  },
  {
    id: CALENDAR_LEGEND_ITEM_ID.ovulation,
    labelKey: 'calendar_legend_ovulation_label',
    descriptionKey: 'calendar_legend_ovulation_description',
    marker: CYCLE_DAY_MARKER.ovulation,
    circleClass: CALENDAR_MARKER_CIRCLE_CLASS.ovulation,
  },
  {
    id: CALENDAR_LEGEND_ITEM_ID.today,
    labelKey: 'calendar_legend_today_label',
    descriptionKey: 'calendar_legend_today_description',
    marker: null,
    isToday: true,
    circleClass: CALENDAR_MARKER_CIRCLE_CLASS.today,
  },
] as const;
