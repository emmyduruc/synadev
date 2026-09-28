import type { SymptomId, SymptomIntensity } from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { StarIcon } from '@/components/ui/icons/StarIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { SYMPTOM_INTENSITY_LABEL_KEYS } from '@/lib/symptoms/symptomEntryConstants';
import { findSymptomOption } from '@/lib/symptoms/symptomEntryHelpers';
import { getSymptomEntryIcon } from '@/lib/symptoms/symptomEntryIcons';
import { cn, semanticColors } from '@/lib/ui';

export type SymptomEntryRowProps = {
  symptomId: SymptomId;
  intensity?: SymptomIntensity;
  isSelected: boolean;
  isFavorite: boolean;
  customLabel?: string;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export const SymptomEntryRow = ({
  symptomId,
  intensity,
  isSelected,
  isFavorite,
  customLabel,
  onPress,
  onToggleFavorite,
}: SymptomEntryRowProps) => {
  const { t } = useTranslate();
  const option = findSymptomOption(symptomId);
  const title = customLabel ?? (option ? t(option.labelKey) : symptomId);

  const statusLabel = (() => {
    if (!isSelected || intensity === undefined) {
      return t('symptom_entry_row_not_selected');
    }

    return t(SYMPTOM_INTENSITY_LABEL_KEYS[intensity]);
  })();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className={cn(
        'flex-row items-center rounded-2xl border bg-card px-3 py-3',
        isSelected ? 'border-primary-300' : 'border-border',
      )}>
      <Box
        align="center"
        justify="center"
        className="h-11 w-11 rounded-2xl bg-lavender-light">
        {getSymptomEntryIcon(symptomId)}
      </Box>

      <Box flex={1} className="ml-3 mr-2" gap="xs">
        <Text size="sm" weight="semibold" numberOfLines={1}>
          {title}
        </Text>
        <Text size="xs" color="foreground-muted" numberOfLines={1}>
          {statusLabel}
        </Text>
      </Box>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('symptom_entry_favorite_toggle_label')}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        onPress={onToggleFavorite}>
        <StarIcon
          size={22}
          filled={isFavorite}
          color={isFavorite ? semanticColors.splashBackground : semanticColors.foregroundMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
