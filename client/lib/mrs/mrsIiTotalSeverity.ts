/**
 * Total MRS-II burden bands (Heinemann et al., 2004).
 * Item-level severity labels remain separate (0-4 per question).
 */
export const MRS_II_TOTAL_MAX = 44;
export const MRS_II_SOMATIC_MAX = 16;
export const MRS_II_PSYCHOLOGICAL_MAX = 16;
export const MRS_II_UROGENITAL_MAX = 12;

export const MRS_II_TOTAL_SEVERITY = {
  none: 'none',
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe',
} as const;

export type MrsIiTotalSeverity =
  (typeof MRS_II_TOTAL_SEVERITY)[keyof typeof MRS_II_TOTAL_SEVERITY];

export const MRS_II_TOTAL_SEVERITY_LABEL_KEYS: Record<MrsIiTotalSeverity, string> =
  {
    [MRS_II_TOTAL_SEVERITY.none]: 'mrs_ii_total_severity_none',
    [MRS_II_TOTAL_SEVERITY.mild]: 'mrs_ii_total_severity_mild',
    [MRS_II_TOTAL_SEVERITY.moderate]: 'mrs_ii_total_severity_moderate',
    [MRS_II_TOTAL_SEVERITY.severe]: 'mrs_ii_total_severity_severe',
  };

export const classifyMrsIiTotalSeverity = (total: number): MrsIiTotalSeverity => {
  if (total <= 4) {
    return MRS_II_TOTAL_SEVERITY.none;
  }

  if (total <= 8) {
    return MRS_II_TOTAL_SEVERITY.mild;
  }

  if (total <= 16) {
    return MRS_II_TOTAL_SEVERITY.moderate;
  }

  return MRS_II_TOTAL_SEVERITY.severe;
};
