import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn } from '@/lib/ui';

export type DailyLogChipProps = {
  label: string;
  emoji: string;
  wellClassName: string;
  isSelected: boolean;
  onPress: () => void;
};

export const DailyLogChip = ({
  label,
  emoji,
  wellClassName,
  isSelected,
  onPress,
}: DailyLogChipProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityState={{ selected: isSelected }}
    onPress={onPress}
    className={cn(
      'flex-row items-center rounded-full border-2 bg-card py-1.5 pl-1.5 pr-4 shadow-sm',
      isSelected ? 'border-primary-500' : 'border-white',
    )}>
    <Box
      align="center"
      justify="center"
      className={cn('mr-2 h-9 w-9 rounded-full', isSelected ? 'bg-primary-500' : wellClassName)}>
      <Text size="base" responsive={false}>
        {emoji}
      </Text>
    </Box>
    <Text size="sm" weight={isSelected ? 'semibold' : 'medium'} responsive={false}>
      {label}
    </Text>
  </TouchableOpacity>
);
