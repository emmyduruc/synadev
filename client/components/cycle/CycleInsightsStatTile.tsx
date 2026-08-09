import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { DASHBOARD_SURFACE } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

export type CycleInsightsStatTileProps = {
  label: string;
  value: string;
};

export const CycleInsightsStatTile = ({
  label,
  value,
}: CycleInsightsStatTileProps) => (
  <Box flex={1} className={cn(DASHBOARD_SURFACE.nestedLift, 'gap-1 px-2.5 py-3')}>
    <Text size="2xs" color="foreground-muted" align="center" numberOfLines={1}>
      {label}
    </Text>
    <Text size="sm" weight="bold" align="center" numberOfLines={1}>
      {value}
    </Text>
  </Box>
);
