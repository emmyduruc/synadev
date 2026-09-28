import { Box } from '@/components/ui/Box';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  SYMPTOM_ENTRY_TAB,
  type SymptomEntryTabId,
} from '@/lib/symptoms/symptomEntryConstants';
import { cn, semanticColors } from '@/lib/ui';

export type SymptomEntryTabsProps = {
  activeTab: SymptomEntryTabId;
  onChangeTab: (tab: SymptomEntryTabId) => void;
};

const TAB_ITEMS: readonly { id: SymptomEntryTabId; labelKey: string }[] = [
  { id: SYMPTOM_ENTRY_TAB.symptoms, labelKey: 'symptom_entry_tab_symptoms' },
  { id: SYMPTOM_ENTRY_TAB.period, labelKey: 'symptom_entry_tab_period' },
  { id: SYMPTOM_ENTRY_TAB.mood, labelKey: 'symptom_entry_tab_mood' },
];

export const SymptomEntryTabs = ({ activeTab, onChangeTab }: SymptomEntryTabsProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" gap="sm">
      {TAB_ITEMS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <TouchableOpacity
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChangeTab(tab.id)}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border px-2 py-3',
              isActive
                ? 'border-primary-500 bg-primary-500'
                : 'border-border bg-card',
            )}>
            {isActive ? (
              <CheckIcon size={14} color={semanticColors.iconOnPrimary} />
            ) : null}
            <Text
              size="xs"
              weight="semibold"
              color={isActive ? 'white' : 'foreground'}
              responsive={false}
              numberOfLines={1}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
