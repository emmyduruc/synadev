import type { PatternContextId, PatternContextResult } from '@syna/shared-utils';

export type UserReportChainStep = {
  id: string;
  emoji: string;
  titleKey: string;
  subtitleKey: string;
};

export type UserReportFactPill = {
  id: string;
  labelKey: string;
  params?: Record<string, string | number>;
};

export type UserReportInsightBlock = {
  id: string;
  titleKey: string;
  bodyKey: string;
  params?: Record<string, string | number>;
};

export type UserReportStoryId =
  | 'sleep_heat'
  | 'movement_sleep'
  | 'stress_energy'
  | 'cycle_mood'
  | 'empty';

export type UserReportViewModel = {
  storyId: UserReportStoryId;
  firstName: string | null;
  trackedDays: number;
  windowDays: number;
  isEmpty: boolean;
  headlineKey: string;
  introKey: string;
  chainSteps: readonly UserReportChainStep[];
  factsTitleKey: string;
  factPills: readonly UserReportFactPill[];
  insights: readonly UserReportInsightBlock[];
  primaryContext: PatternContextResult | null;
  stats: {
    heatNights: number;
    avgSleepHours: number | null;
    lowEnergyDays: number;
    mrsTotal: number | null;
  };
};

export type BuildUserReportInput = {
  firstName: string | null;
  windowDays: number;
  dateKeys: readonly string[];
  symptomsByDate: ReadonlyMap<string, readonly string[]>;
  moodsByDate: ReadonlyMap<
    string,
    { energy: number | null; stress: number | null }
  >;
  healthByDate: ReadonlyMap<string, { sleepHours: number | null }>;
  contexts: readonly PatternContextResult[];
  mrsTotal: number | null;
};

export type { PatternContextId };
