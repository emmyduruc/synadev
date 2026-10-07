import type { GetHealthDailyMetricsQuery } from '@syna/shared-types';

export const queryKeys = {
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },
  symptoms: {
    all: ['symptoms'] as const,
    logs: () => [...queryKeys.symptoms.all, 'logs'] as const,
    catalog: () => [...queryKeys.symptoms.all, 'catalog'] as const,
    favorites: () => [...queryKeys.symptoms.all, 'favorites'] as const,
    custom: () => [...queryKeys.symptoms.all, 'custom'] as const,
  },
  mood: {
    all: ['mood'] as const,
    logs: () => [...queryKeys.mood.all, 'logs'] as const,
  },
  period: {
    all: ['period'] as const,
    days: () => [...queryKeys.period.all, 'days'] as const,
  },
  cycle: {
    all: ['cycle'] as const,
    phase: () => [...queryKeys.cycle.all, 'phase'] as const,
  },
  health: {
    all: ['health'] as const,
    daily: (query: GetHealthDailyMetricsQuery) =>
      [...queryKeys.health.all, 'daily', query.from, query.to] as const,
  },
  assessments: {
    all: ['assessments'] as const,
    mrsLatest: () => [...queryKeys.assessments.all, 'mrs-ii', 'latest'] as const,
    pamLatest: () => [...queryKeys.assessments.all, 'pam-13', 'latest'] as const,
    phqLatest: () => [...queryKeys.assessments.all, 'phq-2', 'latest'] as const,
  },
  report: {
    all: ['report'] as const,
    preferences: () => [...queryKeys.report.all, 'preferences'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    me: () => [...queryKeys.appointments.all, 'me'] as const,
  },
  clinicalProfile: {
    all: ['clinicalProfile'] as const,
    me: () => [...queryKeys.clinicalProfile.all, 'me'] as const,
  },
} as const;
