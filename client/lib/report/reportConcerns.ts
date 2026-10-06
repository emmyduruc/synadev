export const REPORT_CONCERN_ID = {
  takenSeriously: 'taken_seriously',
  openCommunication: 'open_communication',
  notHeardBefore: 'not_heard_before',
  understandNumbers: 'understand_numbers',
  treatmentOptions: 'treatment_options',
  orientOnly: 'orient_only',
  perimenopauseUncertain: 'perimenopause_uncertain',
  decideTogether: 'decide_together',
  littleTime: 'little_time',
  watchNextMonths: 'watch_next_months',
} as const;

export type ReportConcernId =
  (typeof REPORT_CONCERN_ID)[keyof typeof REPORT_CONCERN_ID];

export type ReportConcern = {
  id: ReportConcernId;
  labelKey: string;
};

export const REPORT_CONCERNS: Record<ReportConcernId, ReportConcern> = {
  [REPORT_CONCERN_ID.takenSeriously]: {
    id: REPORT_CONCERN_ID.takenSeriously,
    labelKey: 'report_concern_taken_seriously',
  },
  [REPORT_CONCERN_ID.openCommunication]: {
    id: REPORT_CONCERN_ID.openCommunication,
    labelKey: 'report_concern_open_communication',
  },
  [REPORT_CONCERN_ID.notHeardBefore]: {
    id: REPORT_CONCERN_ID.notHeardBefore,
    labelKey: 'report_concern_not_heard_before',
  },
  [REPORT_CONCERN_ID.understandNumbers]: {
    id: REPORT_CONCERN_ID.understandNumbers,
    labelKey: 'report_concern_understand_numbers',
  },
  [REPORT_CONCERN_ID.treatmentOptions]: {
    id: REPORT_CONCERN_ID.treatmentOptions,
    labelKey: 'report_concern_treatment_options',
  },
  [REPORT_CONCERN_ID.orientOnly]: {
    id: REPORT_CONCERN_ID.orientOnly,
    labelKey: 'report_concern_orient_only',
  },
  [REPORT_CONCERN_ID.perimenopauseUncertain]: {
    id: REPORT_CONCERN_ID.perimenopauseUncertain,
    labelKey: 'report_concern_perimenopause_uncertain',
  },
  [REPORT_CONCERN_ID.decideTogether]: {
    id: REPORT_CONCERN_ID.decideTogether,
    labelKey: 'report_concern_decide_together',
  },
  [REPORT_CONCERN_ID.littleTime]: {
    id: REPORT_CONCERN_ID.littleTime,
    labelKey: 'report_concern_little_time',
  },
  [REPORT_CONCERN_ID.watchNextMonths]: {
    id: REPORT_CONCERN_ID.watchNextMonths,
    labelKey: 'report_concern_watch_next_months',
  },
};

export const REPORT_CONCERN_ORDER = [
  REPORT_CONCERN_ID.takenSeriously,
  REPORT_CONCERN_ID.openCommunication,
  REPORT_CONCERN_ID.notHeardBefore,
  REPORT_CONCERN_ID.understandNumbers,
  REPORT_CONCERN_ID.treatmentOptions,
  REPORT_CONCERN_ID.orientOnly,
  REPORT_CONCERN_ID.perimenopauseUncertain,
  REPORT_CONCERN_ID.decideTogether,
  REPORT_CONCERN_ID.littleTime,
  REPORT_CONCERN_ID.watchNextMonths,
] as const satisfies readonly ReportConcernId[];

export const REPORT_CONCERN_LIST = REPORT_CONCERN_ORDER.map(
  (id) => REPORT_CONCERNS[id],
);
