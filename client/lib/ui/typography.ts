/**
 * Caps OS accessibility / Display font scaling.
 * Without this, Android "Font size" + "Display size" can make SYNA text extreme
 * while other apps look normal (they typically clamp).
 */
export const DEFAULT_MAX_FONT_SIZE_MULTIPLIER = 1.2;

/**
 * Max logical width used when scaling font tokens with moderateScale.
 * Keeps type from growing with tablet / large-phone widths; layout may still scale.
 */
export const FONT_SCALE_MAX_WIDTH = 430;
