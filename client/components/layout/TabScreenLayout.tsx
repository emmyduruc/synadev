import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box, Text } from '@/components/ui';

export type TabScreenLayoutProps = {
  title: string;
  body: string;
};

export const TabScreenLayout = ({ title, body }: TabScreenLayoutProps) => (
  <SynaGradientBackground>
    <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
      <Box flex={1}>
        <AppHeader title={title} showBack={false} />
        <Box flex={1} align="center" justify="center" padding="lg">
          <Text size="2xl" weight="semibold" align="center">
            {body}
          </Text>
        </Box>
      </Box>
    </SafeAreaScreen>
  </SynaGradientBackground>
);
