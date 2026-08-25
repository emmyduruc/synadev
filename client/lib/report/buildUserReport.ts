import {
  PATTERN_CONTEXT_ID,
  PATTERN_STATUS,
  type PatternContextResult,
} from '@syna/shared-utils';

import {
  HEAT_SYMPTOM_IDS,
  REPORT_MIN_TRACKED_DAYS,
  REPORT_WINDOW_DAYS,
} from '@/lib/report/reportConstants';
import type {
  BuildUserReportInput,
  UserReportChainStep,
  UserReportFactPill,
  UserReportInsightBlock,
  UserReportStoryId,
  UserReportViewModel,
} from '@/lib/report/userReportTypes';

const HEAT_SET = new Set<string>(HEAT_SYMPTOM_IDS);

const SLEEP_HEAT_CHAIN: readonly UserReportChainStep[] = [
  {
    id: 'heat',
    emoji: '🔥',
    titleKey: 'user_report_chain_heat_title',
    subtitleKey: 'user_report_chain_heat_subtitle',
  },
  {
    id: 'sleep',
    emoji: '🌙',
    titleKey: 'user_report_chain_sleep_title',
    subtitleKey: 'user_report_chain_sleep_subtitle',
  },
  {
    id: 'recovery',
    emoji: '🔋',
    titleKey: 'user_report_chain_recovery_title',
    subtitleKey: 'user_report_chain_recovery_subtitle',
  },
  {
    id: 'energy',
    emoji: '😫',
    titleKey: 'user_report_chain_energy_title',
    subtitleKey: 'user_report_chain_energy_subtitle',
  },
];

const MOVEMENT_SLEEP_CHAIN: readonly UserReportChainStep[] = [
  {
    id: 'movement',
    emoji: '🚶',
    titleKey: 'user_report_chain_movement_title',
    subtitleKey: 'user_report_chain_movement_subtitle',
  },
  {
    id: 'sleep',
    emoji: '🌙',
    titleKey: 'user_report_chain_sleep_title',
    subtitleKey: 'user_report_chain_sleep_deeper_subtitle',
  },
  {
    id: 'recovery',
    emoji: '💚',
    titleKey: 'user_report_chain_recovery_title',
    subtitleKey: 'user_report_chain_recovery_better_subtitle',
  },
  {
    id: 'energy',
    emoji: '⚡',
    titleKey: 'user_report_chain_day_energy_title',
    subtitleKey: 'user_report_chain_day_energy_subtitle',
  },
];

const STRESS_ENERGY_CHAIN: readonly UserReportChainStep[] = [
  {
    id: 'stress',
    emoji: '🌊',
    titleKey: 'user_report_chain_stress_title',
    subtitleKey: 'user_report_chain_stress_subtitle',
  },
  {
    id: 'sleep',
    emoji: '🌙',
    titleKey: 'user_report_chain_sleep_title',
    subtitleKey: 'user_report_chain_sleep_subtitle',
  },
  {
    id: 'recovery',
    emoji: '🔋',
    titleKey: 'user_report_chain_recovery_title',
    subtitleKey: 'user_report_chain_recovery_subtitle',
  },
  {
    id: 'energy',
    emoji: '😫',
    titleKey: 'user_report_chain_energy_title',
    subtitleKey: 'user_report_chain_energy_subtitle',
  },
];

const CYCLE_MOOD_CHAIN: readonly UserReportChainStep[] = [
  {
    id: 'cycle',
    emoji: '🔄',
    titleKey: 'user_report_chain_cycle_title',
    subtitleKey: 'user_report_chain_cycle_subtitle',
  },
  {
    id: 'mood',
    emoji: '🎭',
    titleKey: 'user_report_chain_mood_title',
    subtitleKey: 'user_report_chain_mood_subtitle',
  },
  {
    id: 'energy',
    emoji: '🔋',
    titleKey: 'user_report_chain_energy_title',
    subtitleKey: 'user_report_chain_energy_subtitle',
  },
  {
    id: 'awareness',
    emoji: '✨',
    titleKey: 'user_report_chain_awareness_title',
    subtitleKey: 'user_report_chain_awareness_subtitle',
  },
];

const pickPrimaryContext = (
  contexts: readonly PatternContextResult[],
): PatternContextResult | null => {
  const actionable = contexts.filter(
    (context) =>
      context.status === PATTERN_STATUS.recognized ||
      context.status === PATTERN_STATUS.emerging,
  );

  if (actionable.length === 0) {
    return null;
  }

  return [...actionable].sort((left, right) => right.strength - left.strength)[0];
};

const toStoryId = (context: PatternContextResult | null): UserReportStoryId => {
  if (!context) {
    return 'empty';
  }

  if (context.id === PATTERN_CONTEXT_ID.sleepHeat) {
    return 'sleep_heat';
  }

  if (context.id === PATTERN_CONTEXT_ID.movementSleep) {
    return 'movement_sleep';
  }

  if (context.id === PATTERN_CONTEXT_ID.stressEnergy) {
    return 'stress_energy';
  }

  if (context.id === PATTERN_CONTEXT_ID.cycleMood) {
    return 'cycle_mood';
  }

  return 'empty';
};

const chainForStory = (storyId: UserReportStoryId): readonly UserReportChainStep[] => {
  if (storyId === 'movement_sleep') {
    return MOVEMENT_SLEEP_CHAIN;
  }

  if (storyId === 'stress_energy') {
    return STRESS_ENERGY_CHAIN;
  }

  if (storyId === 'cycle_mood') {
    return CYCLE_MOOD_CHAIN;
  }

  return SLEEP_HEAT_CHAIN;
};

const countTrackedDays = (input: BuildUserReportInput): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const symptoms = input.symptomsByDate.get(dateKey) ?? [];
    const mood = input.moodsByDate.get(dateKey);
    const health = input.healthByDate.get(dateKey);
    const hasSymptom = symptoms.length > 0;
    const hasMood =
      mood !== undefined && (mood.energy !== null || mood.stress !== null);
    const hasSleep = health?.sleepHours !== null && health?.sleepHours !== undefined;

    if (hasSymptom || hasMood || hasSleep) {
      count += 1;
    }
  }

  return count;
};

const countHeatNights = (input: BuildUserReportInput): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const symptoms = input.symptomsByDate.get(dateKey) ?? [];
    if (symptoms.some((id) => HEAT_SET.has(id))) {
      count += 1;
    }
  }

  return count;
};

const averageSleepHours = (input: BuildUserReportInput): number | null => {
  let sum = 0;
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const hours = input.healthByDate.get(dateKey)?.sleepHours;

    if (hours !== null && hours !== undefined && Number.isFinite(hours) && hours > 0) {
      sum += hours;
      count += 1;
    }
  }

  if (count === 0) {
    return null;
  }

  return Math.round((sum / count) * 10) / 10;
};

const countLowEnergyDays = (input: BuildUserReportInput): number => {
  let count = 0;

  for (const dateKey of input.dateKeys) {
    const energy = input.moodsByDate.get(dateKey)?.energy;

    if (energy !== null && energy !== undefined && energy <= 2) {
      count += 1;
    }
  }

  return count;
};

const severityLabelKey = (mrsTotal: number | null, heatNights: number, trackedDays: number): string => {
  if (mrsTotal !== null) {
    if (mrsTotal <= 4) {
      return 'user_report_fact_symptoms_none';
    }

    if (mrsTotal <= 8) {
      return 'user_report_fact_symptoms_mild';
    }

    if (mrsTotal <= 15) {
      return 'user_report_fact_symptoms_moderate';
    }

    return 'user_report_fact_symptoms_severe';
  }

  if (trackedDays === 0) {
    return 'user_report_fact_symptoms_unknown';
  }

  const ratio = heatNights / trackedDays;

  if (ratio <= 0.25) {
    return 'user_report_fact_symptoms_mild';
  }

  if (ratio <= 0.5) {
    return 'user_report_fact_symptoms_moderate';
  }

  return 'user_report_fact_symptoms_frequent';
};

const buildFacts = (
  storyId: UserReportStoryId,
  trackedDays: number,
  heatNights: number,
  avgSleep: number | null,
  mrsTotal: number | null,
): readonly UserReportFactPill[] => {
  const pills: UserReportFactPill[] = [];

  if (storyId === 'sleep_heat' || heatNights > 0) {
    pills.push({
      id: 'heat_nights',
      labelKey: 'user_report_fact_heat_nights',
      params: { count: heatNights, days: trackedDays },
    });
  }

  pills.push({
    id: 'sleep_quality',
    labelKey:
      avgSleep !== null && avgSleep < 6.5
        ? 'user_report_fact_sleep_interrupted'
        : 'user_report_fact_sleep_tracked',
  });

  if (avgSleep !== null) {
    pills.push({
      id: 'avg_sleep',
      labelKey: 'user_report_fact_avg_sleep',
      params: { hours: avgSleep },
    });
  }

  pills.push({
    id: 'severity',
    labelKey: severityLabelKey(mrsTotal, heatNights, trackedDays),
  });

  return pills;
};

const buildInsights = (
  storyId: UserReportStoryId,
): readonly UserReportInsightBlock[] => {
  let goodNewsBody = 'user_report_insight_sleep_heat_good_news_body';
  let aboutBody = 'user_report_insight_sleep_heat_about_body';
  let notBody = 'user_report_insight_sleep_heat_not_body';

  if (storyId === 'movement_sleep') {
    goodNewsBody = 'user_report_insight_movement_sleep_good_news_body';
    aboutBody = 'user_report_insight_movement_sleep_about_body';
    notBody = 'user_report_insight_movement_sleep_not_body';
  } else if (storyId === 'stress_energy') {
    goodNewsBody = 'user_report_insight_stress_energy_good_news_body';
    aboutBody = 'user_report_insight_stress_energy_about_body';
    notBody = 'user_report_insight_stress_energy_not_body';
  } else if (storyId === 'cycle_mood') {
    goodNewsBody = 'user_report_insight_cycle_mood_good_news_body';
    aboutBody = 'user_report_insight_cycle_mood_about_body';
    notBody = 'user_report_insight_cycle_mood_not_body';
  } else if (storyId === 'empty') {
    goodNewsBody = 'user_report_insight_empty_good_news_body';
    aboutBody = 'user_report_insight_empty_about_body';
    notBody = 'user_report_insight_empty_not_body';
  }

  return [
    {
      id: 'good_news',
      titleKey: 'user_report_insight_good_news_title',
      bodyKey: goodNewsBody,
    },
    {
      id: 'about',
      titleKey: 'user_report_insight_about_title',
      bodyKey: aboutBody,
    },
    {
      id: 'not',
      titleKey: 'user_report_insight_not_title',
      bodyKey: notBody,
    },
  ];
};

const headlineForStory = (storyId: UserReportStoryId): string => {
  if (storyId === 'movement_sleep') {
    return 'user_report_headline_movement_sleep';
  }

  if (storyId === 'stress_energy') {
    return 'user_report_headline_stress_energy';
  }

  if (storyId === 'cycle_mood') {
    return 'user_report_headline_cycle_mood';
  }

  if (storyId === 'empty') {
    return 'user_report_headline_empty';
  }

  return 'user_report_headline_sleep_heat';
};

const introForStory = (storyId: UserReportStoryId): string => {
  if (storyId === 'movement_sleep') {
    return 'user_report_intro_movement_sleep';
  }

  if (storyId === 'stress_energy') {
    return 'user_report_intro_stress_energy';
  }

  if (storyId === 'cycle_mood') {
    return 'user_report_intro_cycle_mood';
  }

  if (storyId === 'empty') {
    return 'user_report_intro_empty';
  }

  return 'user_report_intro_sleep_heat';
};

/**
 * Deterministic user-report view-model from patterns + daily logs.
 * No LLM. Templates are selected from the strongest actionable context.
 */
export const buildUserReport = (input: BuildUserReportInput): UserReportViewModel => {
  const windowDays = input.windowDays > 0 ? input.windowDays : REPORT_WINDOW_DAYS;
  const trackedDays = countTrackedDays(input);
  const heatNights = countHeatNights(input);
  const avgSleepHours = averageSleepHours(input);
  const lowEnergyDays = countLowEnergyDays(input);
  const primaryContext = pickPrimaryContext(input.contexts);

  const hasEnoughData = trackedDays >= REPORT_MIN_TRACKED_DAYS;
  const storyId = hasEnoughData ? toStoryId(primaryContext) : 'empty';
  const isEmpty = storyId === 'empty';

  return {
    storyId,
    firstName: input.firstName?.trim() ? input.firstName.trim() : null,
    trackedDays,
    windowDays,
    isEmpty,
    headlineKey: headlineForStory(storyId),
    introKey: introForStory(storyId),
    chainSteps: isEmpty ? [] : chainForStory(storyId),
    factsTitleKey: 'user_report_facts_title',
    factPills: isEmpty
      ? []
      : buildFacts(storyId, trackedDays, heatNights, avgSleepHours, input.mrsTotal),
    insights: buildInsights(storyId),
    primaryContext: isEmpty ? null : primaryContext,
    stats: {
      heatNights,
      avgSleepHours,
      lowEnergyDays,
      mrsTotal: input.mrsTotal,
    },
  };
};
