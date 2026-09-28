import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type SymptomEntryBottomBarProps = {
  selectedCount: number;
  isSaving: boolean;
  onReady: () => void;
};

export const SymptomEntryBottomBar = ({
  selectedCount,
  isSaving,
  onReady,
}: SymptomEntryBottomBarProps) => {
  const { t } = useTranslate();
  const canSave = !isSaving;

  return (
    <Box
      direction="row"
      align="center"
      justify="between"
      className="border-t border-border bg-card px-5 py-3"
      gap="md">
      <Text size="sm" color="foreground-muted">
        {t('symptom_entry_selected_count', { count: selectedCount })}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={!canSave}
        onPress={onReady}
        className={cn(
          'min-w-28 items-center rounded-full bg-primary-500 px-8 py-3.5',
          !canSave && 'opacity-40',
        )}>
        <Text size="sm" weight="bold" color="white">
          {t('symptom_entry_ready_button')}
        </Text>
      </TouchableOpacity>
    </Box>
  );
};
