import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { cn, semanticColors } from '@/lib/ui';

export type AccordionSectionProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Optional tinted surface for the header row */
  headerClassName?: string;
  accessibilityLabel?: string;
};

export const AccordionSection = ({
  title,
  isExpanded,
  onToggle,
  children,
  headerClassName,
  accessibilityLabel,
}: AccordionSectionProps) => {
  const chevronRotation = isExpanded ? '180deg' : '0deg';

  return (
    <Box className={cn('overflow-hidden rounded-3xl border shadow-sm', headerClassName)}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={accessibilityLabel ?? title}
        onPress={onToggle}
        className="flex-row items-center justify-between px-4 py-3.5">
        <Text size="base" weight="bold" className="flex-1 pr-3">
          {title}
        </Text>
        <Box style={{ transform: [{ rotate: chevronRotation }] }}>
          <ChevronDownIcon size={20} color={semanticColors.foreground} />
        </Box>
      </TouchableOpacity>
      {isExpanded ? <Box className="border-t border-white/60 px-4 pb-4 pt-2">{children}</Box> : null}
    </Box>
  );
};
