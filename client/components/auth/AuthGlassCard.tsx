import type { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { cn } from '@/lib/ui';

export type AuthGlassCardProps = {
  children: ReactNode;
  className?: string;
};

export const AuthGlassCard = ({ children, className }: AuthGlassCardProps) => (
  <Box
    gap="md"
    padding="lg"
    rounded="2xl"
    className={cn(
      'border border-white/60 bg-white/90 shadow-sm shadow-primary-200/20',
      className,
    )}>
    {children}
  </Box>
);
