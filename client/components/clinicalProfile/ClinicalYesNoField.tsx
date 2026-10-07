import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type ClinicalYesNoFieldProps = {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
};

export const ClinicalYesNoField = ({
  label,
  value,
  onChange,
}: ClinicalYesNoFieldProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Text size="sm" family="sans" className="leading-snug">
        {label}
      </Text>
      <Box direction="row" gap="sm">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: value === true }}
          onPress={() => onChange(true)}
          className={cn(
            'flex-1 items-center rounded-2xl border border-border bg-muted/40 px-3 py-3.5',
            value === true && 'border-primary-400 bg-primary-50',
          )}>
          <Text size="sm" weight="normal" family="sans">
            {t('clinical_profile_yes')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: value === false }}
          onPress={() => onChange(false)}
          className={cn(
            'flex-1 items-center rounded-2xl border border-border bg-muted/40 px-3 py-3.5',
            value === false && 'border-primary-400 bg-primary-50',
          )}>
          <Text size="sm" weight="normal" family="sans">
            {t('clinical_profile_no')}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
