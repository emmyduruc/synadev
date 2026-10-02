import { ScrollView } from 'react-native';

import { CourseFrequenciesCard } from '@/components/course/CourseFrequenciesCard';
import { CoursePeriodHeader } from '@/components/course/CoursePeriodHeader';
import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { AppHeader, Box } from '@/components/ui';
import { useCourseFrequencies } from '@/hooks/useCourseFrequencies';
import { useTranslate } from '@/hooks/useTranslate';

const CourseTabScreen = () => {
  const { t } = useTranslate();
  const { summary } = useCourseFrequencies();

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_course_title')} showBack={false} />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}>
            <Box paddingX="lg" gap="lg" className="pt-2">
              <CoursePeriodHeader
                windowDays={summary.windowDays}
                documentedDays={summary.documentedDays}
                emptyDays={summary.emptyDays}
              />
              <CourseFrequenciesCard rows={summary.rows} />
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default CourseTabScreen;
