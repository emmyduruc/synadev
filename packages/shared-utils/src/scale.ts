/** Reference width for responsive scaling (iPhone SE / standard mobile baseline). */
export const BASE_WIDTH = 375;

/** Reference height for responsive scaling. */
export const BASE_HEIGHT = 812;

/**
 * Scale a value proportionally based on screen width.
 * Use for spacing, font sizes, and layout dimensions.
 */
export const scale = (size: number, screenWidth: number): number => {
  return Math.round((screenWidth / BASE_WIDTH) * size);
};

/**
 * Scale a value proportionally based on screen height.
 */
export const verticalScale = (size: number, screenHeight: number): number => {
  return Math.round((screenHeight / BASE_HEIGHT) * size);
};

/**
 * Moderate scale — blends fixed and proportional scaling.
 * factor 0 = no scaling, factor 1 = full proportional scaling.
 */
export const moderateScale = (
  size: number,
  screenWidth: number,
  factor = 0.5,
): number => {
  return Math.round(size + (scale(size, screenWidth) - size) * factor);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
