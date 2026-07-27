import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { cn } from '@/lib/ui';

export type ProfileOptionChipsProps<T extends string> = {
  options: readonly T[];
  labelKeys: Record<T, string>;
  value: T | null;
  onChange: (value: T) => void;
  /** When true, chips stretch side-by-side in equal columns (e.g. Yes/No). */
  equalWidth?: boolean;
};

export const ProfileOptionChips = <T extends string>({
  options,
  labelKeys,
  value,
  onChange,
  equalWidth = false,
}: ProfileOptionChipsProps<T>) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" className="flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value === option;

        return (
          <TouchableOpacity
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option)}
            className={cn(
              'items-center justify-center rounded-full px-4 py-2.5',
              equalWidth ? 'min-w-[48%] flex-1' : undefined,
              isSelected ? 'bg-primary-600' : 'bg-muted',
            )}>
            <Text
              size="sm"
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'white' : 'foreground'}
              align="center"
              responsive={false}>
              {t(labelKeys[option])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
