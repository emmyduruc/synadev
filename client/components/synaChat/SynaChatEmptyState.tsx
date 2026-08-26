import { Box } from '@/components/ui/Box';
import { SparkleIcon } from '@/components/ui/icons/SparkleIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { SYNA_CHAT_SUGGESTION_KEYS } from '@/lib/synaChat/synaChatConstants';
import { cn, semanticColors } from '@/lib/ui';

export type SynaChatEmptyStateProps = {
  onSuggestionPress: (suggestion: string) => void;
  disabled?: boolean;
};

export const SynaChatEmptyState = ({
  onSuggestionPress,
  disabled = false,
}: SynaChatEmptyStateProps) => {
  const { t } = useTranslate();

  return (
    <Box flex={1} align="center" justify="center" paddingX="lg" className="pb-8">
      <Box
        align="center"
        justify="center"
        className={cn('mb-5 h-16 w-16', DASHBOARD_ICON_WELL.sparkle)}>
        <SparkleIcon size={28} color={semanticColors.iconOnPrimary} />
      </Box>

      <Text size="2xl" weight="bold" align="center" className="text-black">
        {t('syna_chat_empty_title')}
      </Text>
      <Text size="sm" align="center" className="mt-2 leading-relaxed text-black/65">
        {t('syna_chat_empty_subtitle')}
      </Text>

      <Box className="mt-8 w-full gap-2">
        {SYNA_CHAT_SUGGESTION_KEYS.map((key) => {
          const label = t(key);

          return (
            <TouchableOpacity
              key={key}
              accessibilityRole="button"
              disabled={disabled}
              onPress={() => onSuggestionPress(label)}
              className="rounded-2xl border border-white/80 bg-card/90 px-4 py-3.5 shadow-sm">
              <Text size="sm" weight="medium" className="text-black">
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
};
