import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { FAMILY_CANCER } from '@/lib/profile/profileSettingsCatalog';
import { cn } from '@/lib/ui';

export type ProfileMultiOptionChipsProps<T extends string> = {
  options: readonly T[];
  labelKeys: Record<T, string>;
  values: readonly T[];
  onChange: (values: T[]) => void;
  /** Option that clears other selections when chosen (e.g. "No"). */
  exclusiveOption?: T;
};

export const ProfileMultiOptionChips = <T extends string>({
  options,
  labelKeys,
  values,
  onChange,
  exclusiveOption,
}: ProfileMultiOptionChipsProps<T>) => {
  const { t } = useTranslate();

  const toggle = (option: T) => {
    if (exclusiveOption && option === exclusiveOption) {
      onChange([option]);
      return;
    }

    const withoutExclusive = exclusiveOption
      ? values.filter((value) => value !== exclusiveOption)
      : [...values];

    if (withoutExclusive.includes(option)) {
      onChange(withoutExclusive.filter((value) => value !== option));
      return;
    }

    onChange([...withoutExclusive, option]);
  };

  return (
    <Box direction="row" className="flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = values.includes(option);

        return (
          <TouchableOpacity
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => toggle(option)}
            className={cn(
              'items-center justify-center rounded-full px-4 py-2.5',
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

/** Default exclusive option for family-cancer multi-select. */
export const FAMILY_CANCER_EXCLUSIVE = FAMILY_CANCER.no;
