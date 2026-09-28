import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { SymptomExtraOption } from '@/lib/symptoms/symptomExtrasConfig';
import { cn } from '@/lib/ui';

export type SymptomExtraOptionButtonsProps = {
  options: readonly SymptomExtraOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  layout?: 'row' | 'grid';
};

export const SymptomExtraOptionButtons = ({
  options,
  selectedValue,
  onSelect,
  layout = 'row',
}: SymptomExtraOptionButtonsProps) => {
  const { t } = useTranslate();

  const renderButton = (option: SymptomExtraOption, className?: string) => {
    const isSelected = selectedValue === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => onSelect(option.value)}
        className={cn(
          'items-center justify-center rounded-2xl border px-3 py-3.5',
          isSelected ? 'border-primary-500 bg-primary-500' : 'border-border bg-card',
          className,
        )}>
        <Text
          size="sm"
          weight="medium"
          color={isSelected ? 'white' : 'foreground'}
          responsive={false}
          className="text-center">
          {t(option.labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  const useGrid = layout === 'grid' || options.length === 4;

  if (useGrid && options.length >= 3) {
    const rows: SymptomExtraOption[][] = [];

    for (let index = 0; index < options.length; index += 2) {
      rows.push([...options.slice(index, index + 2)]);
    }

    return (
      <Box gap="sm">
        {rows.map((row) => (
          <Box key={row.map((item) => item.value).join('-')} direction="row" gap="sm">
            {row.map((option) => renderButton(option, 'flex-1'))}
            {row.length === 1 ? <Box className="flex-1" /> : null}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box direction="row" gap="sm">
      {options.map((option) => renderButton(option, 'flex-1'))}
    </Box>
  );
};
