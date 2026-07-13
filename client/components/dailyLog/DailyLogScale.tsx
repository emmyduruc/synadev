import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn } from '@/lib/ui';

export type DailyLogScaleProps = {
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  levels?: number;
};

export const DailyLogScale = ({
  value,
  onChange,
  lowLabel,
  highLabel,
  levels = 5,
}: DailyLogScaleProps) => {
  const steps = Array.from({ length: levels }, (_, index) => index + 1);

  return (
    <Box gap="sm">
      <Box direction="row" className="gap-2">
        {steps.map((step) => {
          const isSelected = value === step;

          return (
            <TouchableOpacity
              key={step}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(isSelected ? 0 : step)}
              className={cn(
                'h-11 flex-1 items-center justify-center rounded-2xl border-2 bg-card',
                isSelected ? 'border-primary-500' : 'border-white',
              )}>
              <Text
                size="base"
                weight={isSelected ? 'bold' : 'medium'}
                color={isSelected ? 'primary' : 'foreground-muted'}
                responsive={false}>
                {step}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
      <Box direction="row" justify="between" className="px-1">
        <Text size="2xs" color="foreground-muted" responsive={false}>
          {lowLabel}
        </Text>
        <Text size="2xs" color="foreground-muted" responsive={false}>
          {highLabel}
        </Text>
      </Box>
    </Box>
  );
};
