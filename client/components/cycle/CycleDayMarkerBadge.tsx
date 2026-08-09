import { CYCLE_DAY_MARKER, type CycleDayMarker } from '@syna/shared-utils';

import { Box } from '@/components/ui/Box';
import { BloodDropIcon } from '@/components/ui/icons/BloodDropIcon';
import { OvulationPhaseIcon } from '@/components/ui/icons/OvulationPhaseIcon';
import { cn, semanticColors } from '@/lib/ui';

export type CycleDayMarkerBadgeProps = {
  marker: CycleDayMarker | null;
  size?: 'sm' | 'md';
};

export const CycleDayMarkerBadge = ({
  marker,
  size = 'sm',
}: CycleDayMarkerBadgeProps) => {
  if (!marker) {
    return <Box className={size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'} />;
  }

  const iconSize = size === 'sm' ? 10 : 14;

  if (marker === CYCLE_DAY_MARKER.period) {
    return <BloodDropIcon size={iconSize} color={semanticColors.splashBackground} />;
  }

  if (marker === CYCLE_DAY_MARKER.predictedPeriod) {
    return (
      <BloodDropIcon size={iconSize} color={semanticColors.ovum.dustyRose} />
    );
  }

  if (marker === CYCLE_DAY_MARKER.ovulation) {
    return (
      <OvulationPhaseIcon size={iconSize} color={semanticColors.ovum.lavender} />
    );
  }

  return (
    <Box
      className={cn(
        'rounded-full border-2 border-sage-mist bg-sage-mist-light',
        size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
      )}
    />
  );
};
