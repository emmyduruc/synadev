import { Box, Text } from '@/components/ui';

export const AuthDivider = () => (
  <Box direction="row" align="center" className="w-full">
    <Box flex={1} className="h-px bg-neutral-200" />
    <Text size="xs" color="foreground-muted" className="px-3">
      or
    </Text>
    <Box flex={1} className="h-px bg-neutral-200" />
  </Box>
);
