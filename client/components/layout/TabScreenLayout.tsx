import { SafeAreaView } from 'react-native-safe-area-context';

import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box, Text } from '@/components/ui';

export type TabScreenLayoutProps = {
  title: string;
  body: string;
};

export const TabScreenLayout = ({ title, body }: TabScreenLayoutProps) => (
  <SynaGradientBackground>
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Box flex={1}>
        <AppHeader title={title} showBack={false} />
        <Box flex={1} align="center" justify="center" padding="lg">
          <Text size="2xl" weight="semibold" align="center">
            {body}
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
  </SynaGradientBackground>
);
