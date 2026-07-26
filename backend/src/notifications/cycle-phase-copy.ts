import type { AppLocale, CyclePhaseSnapshotDto } from '@syna/shared-types';
import { DEFAULT_APP_LOCALE, resolveAppLocale } from '@syna/shared-types';

type PhaseId = NonNullable<CyclePhaseSnapshotDto['phase']>;

type PhaseCopy = {
  subject: string;
  pushTitle: string;
  body: string;
  cycleDayLabel: string;
  nextPeriodLabel: string;
};

const COPY_BY_LOCALE: Record<AppLocale, Record<PhaseId, PhaseCopy>> = {
  de: {
    period: {
      subject: 'SYNA: Du bist in der Periodenphase',
      pushTitle: 'Du bist in der Periodenphase',
      body: 'Dein Zyklus-Schätzwert zeigt die Menstruationsphase. Ruhe dich aus, trink genug und tracke in SYNA, wie du dich fühlst. Das ist Orientierung — keine medizinische Beratung.',
      cycleDayLabel: 'Zyklustag',
      nextPeriodLabel: 'Voraussichtliche nächste Periode',
    },
    follicular: {
      subject: 'SYNA: Du bist in der Follikelphase',
      pushTitle: 'Du bist in der Follikelphase',
      body: 'Östrogen steigt typischerweise. Viele spüren mehr Energie und Fokus — gut zum Planen und Bewegen. Hör trotzdem auf deinen Körper. Nur Orientierung, keine medizinische Beratung.',
      cycleDayLabel: 'Zyklustag',
      nextPeriodLabel: 'Voraussichtliche nächste Periode',
    },
    ovulation: {
      subject: 'SYNA: Du bist um den Eisprung herum',
      pushTitle: 'Du bist um den Eisprung herum',
      body: 'Du bist nahe deinem geschätzten Eisprung. Energie und sozialer Drive können peaken. Achte auf Fruchtbarkeit, wenn das für dich relevant ist. Nur Orientierung, keine medizinische Beratung.',
      cycleDayLabel: 'Zyklustag',
      nextPeriodLabel: 'Voraussichtliche nächste Periode',
    },
    luteal: {
      subject: 'SYNA: Du bist in der Lutealphase',
      pushTitle: 'Du bist in der Lutealphase',
      body: 'Progesteron steigt oft jetzt. Viele bevorzugen ruhigere Routinen — entscheide dich bei Nebel oder Gereiztheit nicht zu schweren Themen. Nur Orientierung, keine medizinische Beratung.',
      cycleDayLabel: 'Zyklustag',
      nextPeriodLabel: 'Voraussichtliche nächste Periode',
    },
  },
  en: {
    period: {
      subject: 'SYNA: You’re in your period phase',
      pushTitle: 'You’re in your period phase',
      body: 'Your cycle estimate shows you’re in the menstrual (period) phase. Rest, hydrate, and track how you feel in SYNA. This is guidance, not medical advice.',
      cycleDayLabel: 'Cycle day',
      nextPeriodLabel: 'Predicted next period',
    },
    follicular: {
      subject: 'SYNA: You’re in your follicular phase',
      pushTitle: 'You’re in your follicular phase',
      body: 'Estrogen is typically rising. Many people feel more energy and focus. A good window for planning and movement — still listen to your body. Guidance only, not medical advice.',
      cycleDayLabel: 'Cycle day',
      nextPeriodLabel: 'Predicted next period',
    },
    ovulation: {
      subject: 'SYNA: You’re around ovulation',
      pushTitle: 'You’re around ovulation',
      body: 'You’re near your estimated ovulation window. Energy and social drive can peak. Stay aware of fertility if that matters for you. Guidance only, not medical advice.',
      cycleDayLabel: 'Cycle day',
      nextPeriodLabel: 'Predicted next period',
    },
    luteal: {
      subject: 'SYNA: You’re in your luteal phase',
      pushTitle: 'You’re in your luteal phase',
      body: 'Progesterone often rises now. You may prefer quieter routines — go easy on high-stakes decisions when you feel foggy or irritable. Guidance only, not medical advice.',
      cycleDayLabel: 'Cycle day',
      nextPeriodLabel: 'Predicted next period',
    },
  },
};

export const getCyclePhaseCopy = (
  phase: PhaseId,
  locale: string | null | undefined,
): PhaseCopy => {
  const resolved = resolveAppLocale(locale ?? DEFAULT_APP_LOCALE);
  return COPY_BY_LOCALE[resolved][phase];
};

export const formatCyclePhaseEmailText = (
  copy: PhaseCopy,
  snapshot: CyclePhaseSnapshotDto,
): string =>
  `${copy.body}\n\n${copy.cycleDayLabel}: ${snapshot.cycleDay ?? '—'}\n${copy.nextPeriodLabel}: ${snapshot.nextPeriodDateKey ?? '—'}`;
