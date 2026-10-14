import {
  PERIOD_BLEEDING_TYPE,
  PERIOD_BLEEDING_TYPES,
  PERIOD_OBSERVATION,
  PERIOD_OBSERVATIONS,
  PERIOD_STRENGTH,
  PERIOD_STRENGTHS,
  type PeriodBleedingType,
  type PeriodObservation,
  type PeriodStrength,
} from '@syna/shared-types';

export {
  PERIOD_BLEEDING_TYPE,
  PERIOD_BLEEDING_TYPES,
  PERIOD_OBSERVATION,
  PERIOD_OBSERVATIONS,
  PERIOD_STRENGTH,
  PERIOD_STRENGTHS,
};

export type PeriodBleedingDetails = {
  isFirstDay: boolean | null;
  bleedingType: PeriodBleedingType | null;
  strength: PeriodStrength | null;
  observations: PeriodObservation[];
  notes: string;
};

export const EMPTY_PERIOD_BLEEDING_DETAILS: PeriodBleedingDetails = {
  isFirstDay: null,
  bleedingType: null,
  strength: null,
  observations: [],
  notes: '',
};

export const PERIOD_BLEEDING_TYPE_LABEL_KEYS: Record<
  PeriodBleedingType,
  string
> = {
  [PERIOD_BLEEDING_TYPE.period]: 'period_bleeding_type_period',
  [PERIOD_BLEEDING_TYPE.spotting]: 'period_bleeding_type_spotting',
  [PERIOD_BLEEDING_TYPE.breakthrough]: 'period_bleeding_type_breakthrough',
};

export const PERIOD_STRENGTH_LABEL_KEYS: Record<PeriodStrength, string> = {
  [PERIOD_STRENGTH.light]: 'period_bleeding_strength_light',
  [PERIOD_STRENGTH.medium]: 'period_bleeding_strength_medium',
  [PERIOD_STRENGTH.strong]: 'period_bleeding_strength_strong',
};

export const PERIOD_OBSERVATION_LABEL_KEYS: Record<PeriodObservation, string> = {
  [PERIOD_OBSERVATION.lumps_or_tissue]: 'period_bleeding_observation_lumps_or_tissue',
  [PERIOD_OBSERVATION.unusually_long]: 'period_bleeding_observation_unusually_long',
  [PERIOD_OBSERVATION.more_severe_pain]: 'period_bleeding_observation_more_severe_pain',
  [PERIOD_OBSERVATION.restricted_daily_life]:
    'period_bleeding_observation_restricted_daily_life',
  [PERIOD_OBSERVATION.none]: 'period_bleeding_observation_none',
};
