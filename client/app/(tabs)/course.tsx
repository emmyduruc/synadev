import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';

const CourseTabScreen = () => {
  const { t } = useTranslate();

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_course_title')} showBack={false} />
          <Box flex={1} paddingX="lg" paddingY="md" justify="center" align="center">
            <Text size="sm" color="foreground-muted" className="text-center leading-relaxed">
              {t('tab_course_placeholder')}
            </Text>
          </Box>
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default CourseTabScreen;
