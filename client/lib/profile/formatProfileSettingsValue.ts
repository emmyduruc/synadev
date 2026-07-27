/** Display a profile settings value, or the shared empty placeholder. */
export const formatProfileSettingsValue = (
  value: string | null | undefined,
  emptyValue: string,
): string => {
  if (!value || value.trim().length === 0) {
    return emptyValue;
  }

  return value.trim();
};
