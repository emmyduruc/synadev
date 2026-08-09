import { SymbolView } from 'expo-symbols';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn, semanticColors } from '@/lib/ui';

export type DashboardSetupProgressNodeProps = {
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isSelected: boolean;
  onPress: () => void;
};

export const DashboardSetupProgressNode = ({
  label,
  isCompleted,
  isCurrent,
  isSelected,
  onPress,
}: DashboardSetupProgressNodeProps) => {
  const nodeClassName = (() => {
    if (isCompleted) {
      return 'border-success-500 bg-success-500';
    }

    if (isCurrent) {
      return 'border-error-500 bg-error-50';
    }

    return 'border-error-300 bg-error-50';
  })();

  const labelClassName = (() => {
    if (isCompleted) {
      return 'text-success-700';
    }

    if (isCurrent) {
      return 'text-error-700';
    }

    return 'text-error-600';
  })();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      activeOpacity={0.75}
      className="w-[56px] items-center">
      <Box
        align="center"
        justify="center"
        className={cn(
          'h-7 w-7 rounded-full border-2',
          nodeClassName,
          isSelected && !isCompleted && 'border-primary-500',
          isSelected && isCompleted && 'border-success-700',
        )}>
        {isCompleted ? (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={12}
            tintColor={semanticColors.card}
          />
        ) : (
          <Box
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isCurrent ? 'bg-error-500' : 'bg-error-400',
            )}
          />
        )}
      </Box>
      <Text
        size="2xs"
        weight={isCurrent || isCompleted ? 'semibold' : 'medium'}
        align="center"
        className={cn('mt-1 leading-tight', labelClassName)}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
