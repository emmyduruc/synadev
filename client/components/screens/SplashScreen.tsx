import { Box, Text } from '@/components/ui';

export const SplashScreen = () => (
  <Box flex={1} align="center" justify="center" className="bg-primary-500">
    {/* pr compensates for RN letter-spacing, which otherwise clips the final "A". */}
    <Text size="5xl" weight="bold" color="white" className="tracking-widest pr-3">
      SYNA
    </Text>
  </Box>
);
