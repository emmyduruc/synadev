export type MoodOption = {
  id: string;
  emoji: string;
  labelKey: string;
  /** Emoji well tint grouped by emotional tone */
  wellClassName: string;
};

const POSITIVE_WELL = 'bg-apricot';
const NEUTRAL_WELL = 'bg-secondary-200';
const CHALLENGING_WELL = 'bg-lavender';

/**
 * SYNA mood taxonomy — one primary mood + optional secondary feelings.
 * Ordered positive → neutral → challenging so the primary picker reads warmly.
 */
export const MOOD_OPTIONS: readonly MoodOption[] = [
  { id: 'happy', emoji: '😄', labelKey: 'mood_happy', wellClassName: POSITIVE_WELL },
  { id: 'calm', emoji: '😌', labelKey: 'mood_calm', wellClassName: POSITIVE_WELL },
  { id: 'content', emoji: '🙂', labelKey: 'mood_content', wellClassName: POSITIVE_WELL },
  { id: 'energetic', emoji: '⚡', labelKey: 'mood_energetic', wellClassName: POSITIVE_WELL },
  { id: 'confident', emoji: '💪', labelKey: 'mood_confident', wellClassName: POSITIVE_WELL },
  { id: 'loved', emoji: '🥰', labelKey: 'mood_loved', wellClassName: POSITIVE_WELL },
  { id: 'neutral', emoji: '😐', labelKey: 'mood_neutral', wellClassName: NEUTRAL_WELL },
  { id: 'irritable', emoji: '😠', labelKey: 'mood_irritable', wellClassName: CHALLENGING_WELL },
  { id: 'anxious', emoji: '😰', labelKey: 'mood_anxious', wellClassName: CHALLENGING_WELL },
  { id: 'sad', emoji: '😢', labelKey: 'mood_sad', wellClassName: CHALLENGING_WELL },
  { id: 'swings', emoji: '🎭', labelKey: 'mood_swings', wellClassName: CHALLENGING_WELL },
  { id: 'overwhelmed', emoji: '🤯', labelKey: 'mood_overwhelmed', wellClassName: CHALLENGING_WELL },
  { id: 'angry', emoji: '😡', labelKey: 'mood_angry', wellClassName: CHALLENGING_WELL },
  { id: 'tearful', emoji: '😭', labelKey: 'mood_tearful', wellClassName: CHALLENGING_WELL },
  { id: 'unmotivated', emoji: '😮‍💨', labelKey: 'mood_unmotivated', wellClassName: CHALLENGING_WELL },
  { id: 'lonely', emoji: '🥺', labelKey: 'mood_lonely', wellClassName: CHALLENGING_WELL },
];

export const MOOD_SECTION_SURFACE = {
  primary: 'border-primary-200 bg-primary-50',
  feelings: 'border-lavender bg-lavender-light',
  energy: 'border-sage-mist bg-sage-mist-light',
  stress: 'border-apricot bg-apricot-light',
  note: 'border-secondary-200 bg-secondary-50',
} as const;

export const MOOD_SCALE_MAX = 5;
