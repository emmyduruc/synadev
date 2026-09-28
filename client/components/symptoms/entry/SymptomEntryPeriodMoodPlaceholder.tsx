import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { SYMPTOM_ENTRY_TAB, type SymptomEntryTabId } from '@/lib/symptoms/symptomEntryConstants';

export type SymptomEntryPeriodMoodPlaceholderProps = {
  tab: Exclude<SymptomEntryTabId, typeof SYMPTOM_ENTRY_TAB.symptoms>;
};

export const SymptomEntryPeriodMoodPlaceholder = ({
  tab,
}: SymptomEntryPeriodMoodPlaceholderProps) => {
  const { t } = useTranslate();

  let titleKey = 'symptom_entry_mood_placeholder_title';
  let bodyKey = 'symptom_entry_mood_placeholder_body';

  if (tab === SYMPTOM_ENTRY_TAB.period) {
    titleKey = 'symptom_entry_period_placeholder_title';
    bodyKey = 'symptom_entry_period_placeholder_body';
  }

  return (
    <Box className="rounded-2xl border border-border bg-card px-4 py-6" gap="sm">
      <Text size="base" weight="semibold">
        {t(titleKey)}
      </Text>
      <Text size="sm" color="foreground-muted" className="leading-relaxed">
        {t(bodyKey)}
      </Text>
    </Box>
  );
};
