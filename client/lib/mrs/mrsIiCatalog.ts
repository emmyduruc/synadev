import type { MrsIiItemId, MrsIiSubscaleId } from './mrsIiTypes';
import { MRS_II_SUBSCALE } from './mrsIiTypes';

export type MrsIiItem = {
  id: MrsIiItemId;
  /** 1-based instrument order (fixed). */
  index: number;
  subscaleId: MrsIiSubscaleId;
  titleKey: string;
  explanationKey: string;
};

export type MrsIiSubscale = {
  id: MrsIiSubscaleId;
  titleKey: string;
  subtitleKey: string;
  sectionClassName: string;
  itemIds: readonly MrsIiItemId[];
};

export const MRS_II_ITEM_COUNT = 11;

/** Fixed instrument order — do not reorder. */
export const MRS_II_ITEMS: readonly MrsIiItem[] = [
  {
    id: 'hot_flushes',
    index: 1,
    subscaleId: MRS_II_SUBSCALE.somatic,
    titleKey: 'mrs_ii_item_hot_flushes',
    explanationKey: 'mrs_ii_item_hot_flushes_explanation',
  },
  {
    id: 'heart_discomfort',
    index: 2,
    subscaleId: MRS_II_SUBSCALE.somatic,
    titleKey: 'mrs_ii_item_heart_discomfort',
    explanationKey: 'mrs_ii_item_heart_discomfort_explanation',
  },
  {
    id: 'sleep_problems',
    index: 3,
    subscaleId: MRS_II_SUBSCALE.somatic,
    titleKey: 'mrs_ii_item_sleep_problems',
    explanationKey: 'mrs_ii_item_sleep_problems_explanation',
  },
  {
    id: 'joint_muscular_discomfort',
    index: 4,
    subscaleId: MRS_II_SUBSCALE.somatic,
    titleKey: 'mrs_ii_item_joint_muscular_discomfort',
    explanationKey: 'mrs_ii_item_joint_muscular_discomfort_explanation',
  },
  {
    id: 'depressive_mood',
    index: 5,
    subscaleId: MRS_II_SUBSCALE.psychological,
    titleKey: 'mrs_ii_item_depressive_mood',
    explanationKey: 'mrs_ii_item_depressive_mood_explanation',
  },
  {
    id: 'irritability',
    index: 6,
    subscaleId: MRS_II_SUBSCALE.psychological,
    titleKey: 'mrs_ii_item_irritability',
    explanationKey: 'mrs_ii_item_irritability_explanation',
  },
  {
    id: 'anxiety',
    index: 7,
    subscaleId: MRS_II_SUBSCALE.psychological,
    titleKey: 'mrs_ii_item_anxiety',
    explanationKey: 'mrs_ii_item_anxiety_explanation',
  },
  {
    id: 'physical_mental_exhaustion',
    index: 8,
    subscaleId: MRS_II_SUBSCALE.psychological,
    titleKey: 'mrs_ii_item_physical_mental_exhaustion',
    explanationKey: 'mrs_ii_item_physical_mental_exhaustion_explanation',
  },
  {
    id: 'sexual_problems',
    index: 9,
    subscaleId: MRS_II_SUBSCALE.urogenital,
    titleKey: 'mrs_ii_item_sexual_problems',
    explanationKey: 'mrs_ii_item_sexual_problems_explanation',
  },
  {
    id: 'bladder_problems',
    index: 10,
    subscaleId: MRS_II_SUBSCALE.urogenital,
    titleKey: 'mrs_ii_item_bladder_problems',
    explanationKey: 'mrs_ii_item_bladder_problems_explanation',
  },
  {
    id: 'vaginal_dryness',
    index: 11,
    subscaleId: MRS_II_SUBSCALE.urogenital,
    titleKey: 'mrs_ii_item_vaginal_dryness',
    explanationKey: 'mrs_ii_item_vaginal_dryness_explanation',
  },
] as const;

export const MRS_II_SUBSCALES: readonly MrsIiSubscale[] = [
  {
    id: MRS_II_SUBSCALE.somatic,
    titleKey: 'mrs_ii_subscale_somatic_title',
    subtitleKey: 'mrs_ii_subscale_somatic_subtitle',
    sectionClassName: 'border-apricot bg-apricot-light',
    itemIds: [
      'hot_flushes',
      'heart_discomfort',
      'sleep_problems',
      'joint_muscular_discomfort',
    ],
  },
  {
    id: MRS_II_SUBSCALE.psychological,
    titleKey: 'mrs_ii_subscale_psychological_title',
    subtitleKey: 'mrs_ii_subscale_psychological_subtitle',
    sectionClassName: 'border-lavender bg-lavender-light',
    itemIds: [
      'depressive_mood',
      'irritability',
      'anxiety',
      'physical_mental_exhaustion',
    ],
  },
  {
    id: MRS_II_SUBSCALE.urogenital,
    titleKey: 'mrs_ii_subscale_urogenital_title',
    subtitleKey: 'mrs_ii_subscale_urogenital_subtitle',
    sectionClassName: 'border-dusty-rose bg-dusty-rose-light',
    itemIds: ['sexual_problems', 'bladder_problems', 'vaginal_dryness'],
  },
] as const;

export const MRS_II_SEVERITY_LABEL_KEYS = {
  0: 'mrs_ii_severity_none',
  1: 'mrs_ii_severity_mild',
  2: 'mrs_ii_severity_moderate',
  3: 'mrs_ii_severity_severe',
  4: 'mrs_ii_severity_very_severe',
} as const;

export const createEmptyMrsIiAnswers = (): Record<MrsIiItemId, null> => ({
  hot_flushes: null,
  heart_discomfort: null,
  sleep_problems: null,
  joint_muscular_discomfort: null,
  depressive_mood: null,
  irritability: null,
  anxiety: null,
  physical_mental_exhaustion: null,
  sexual_problems: null,
  bladder_problems: null,
  vaginal_dryness: null,
});
