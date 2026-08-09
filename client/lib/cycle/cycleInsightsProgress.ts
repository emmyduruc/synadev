import {
  CYCLE_PHASE,
  OVULATION_WINDOW_RADIUS_DAYS,
  type CyclePhase,
  type CyclePhaseSnapshot,
} from '@syna/shared-utils';

export type CycleInsightsMilestoneKind = 'ovulation' | 'period';

export type CycleInsightsMilestone = {
  kind: CycleInsightsMilestoneKind;
  daysUntil: number;
};

export type CycleInsightsNextPhase = {
  phase: CyclePhase;
  daysUntil: number;
};

export type CycleInsightsProgress = {
  progressPercent: number;
  milestone: CycleInsightsMilestone | null;
  nextPhase: CycleInsightsNextPhase | null;
};

type SnapshotLike = Pick<
  CyclePhaseSnapshot,
  | 'phase'
  | 'cycleDay'
  | 'cycleLengthDays'
  | 'periodLengthDays'
  | 'ovulationDay'
  | 'nextPeriodDateKey'
  | 'hasPeriodData'
>;

const daysBetweenDateKeys = (fromDateKey: string, toDateKey: string): number => {
  const from = new Date(`${fromDateKey}T12:00:00`).getTime();
  const to = new Date(`${toDateKey}T12:00:00`).getTime();
  return Math.round((to - from) / 86_400_000);
};

const resolveNextPhase = (
  snapshot: SnapshotLike,
): CycleInsightsNextPhase | null => {
  const { phase, cycleDay, periodLengthDays, ovulationDay, cycleLengthDays } =
    snapshot;

  if (!phase || cycleDay === null || ovulationDay === null) {
    return null;
  }

  const ovulationStart = ovulationDay - OVULATION_WINDOW_RADIUS_DAYS;
  const ovulationEnd = ovulationDay + OVULATION_WINDOW_RADIUS_DAYS;

  if (phase === CYCLE_PHASE.period) {
    const startsOnCycleDay = periodLengthDays + 1;
    return {
      phase: CYCLE_PHASE.follicular,
      daysUntil: Math.max(0, startsOnCycleDay - cycleDay),
    };
  }

  if (phase === CYCLE_PHASE.follicular) {
    return {
      phase: CYCLE_PHASE.ovulation,
      daysUntil: Math.max(0, ovulationStart - cycleDay),
    };
  }

  if (phase === CYCLE_PHASE.ovulation) {
    return {
      phase: CYCLE_PHASE.luteal,
      daysUntil: Math.max(0, ovulationEnd + 1 - cycleDay),
    };
  }

  return {
    phase: CYCLE_PHASE.period,
    daysUntil: Math.max(0, cycleLengthDays + 1 - cycleDay),
  };
};

const resolveMilestone = (
  snapshot: SnapshotLike,
  asOfDateKey: string,
): CycleInsightsMilestone | null => {
  const { cycleDay, ovulationDay, nextPeriodDateKey } = snapshot;

  if (cycleDay === null) {
    return null;
  }

  if (ovulationDay !== null && cycleDay < ovulationDay) {
    return {
      kind: 'ovulation',
      daysUntil: ovulationDay - cycleDay,
    };
  }

  if (nextPeriodDateKey) {
    return {
      kind: 'period',
      daysUntil: Math.max(0, daysBetweenDateKeys(asOfDateKey, nextPeriodDateKey)),
    };
  }

  return null;
};

/**
 * Flo-style hero inputs: cycle progress ring, countdown to ovulation/period,
 * and the next phase transition for midlife cycle clarity.
 */
export const resolveCycleInsightsProgress = (
  snapshot: SnapshotLike | null,
  asOfDateKey: string,
): CycleInsightsProgress => {
  if (!snapshot?.hasPeriodData || snapshot.cycleDay === null) {
    return {
      progressPercent: 0,
      milestone: null,
      nextPhase: null,
    };
  }

  const progressPercent = Math.min(
    100,
    Math.round((snapshot.cycleDay / Math.max(1, snapshot.cycleLengthDays)) * 100),
  );

  return {
    progressPercent,
    milestone: resolveMilestone(snapshot, asOfDateKey),
    nextPhase: resolveNextPhase(snapshot),
  };
};
