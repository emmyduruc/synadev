import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { CalendarYearPlaceholder } from '@/components/calendar/CalendarYearPlaceholder';
import { Box } from '@/components/ui/Box';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  buildYearMonths,
  CALENDAR_VIEW,
  type CalendarView,
} from '@/lib/dashboard/calendarUtils';
import { DASHBOARD_ICON_WELL } from '@/lib/dashboard/surfaces';
import { cn } from '@/lib/ui';

const CalendarScreen = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [activeView, setActiveView] = useState<CalendarView>(CALENDAR_VIEW.month);
  const currentYear = new Date().getFullYear();
  const months = useMemo(() => buildYearMonths(currentYear), [currentYear]);

  return (
    <Box flex={1} fullWidth background="background">
      <Box
        flex={1}
        style={{
          paddingTop: safeAreaTop,
          paddingBottom: safeAreaBottom,
        }}>
        <Box direction="row" align="center" justify="between" paddingX="lg" paddingY="sm">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('calendar_close_accessibility_label')}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            onPress={() => router.back()}
            className={cn('h-11 w-11', DASHBOARD_ICON_WELL.gem)}>
            <CloseIcon size={22} />
          </TouchableOpacity>
          <Text size="lg" weight="bold">
            {t('calendar_screen_title')}
          </Text>
          <Box className="h-11 w-11" />
        </Box>

        <Box paddingX="lg" className="mb-4">
          <CalendarViewToggle
            activeView={activeView}
            onChange={setActiveView}
            monthLabel={t('calendar_view_month')}
            yearLabel={t('calendar_view_year')}
          />
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Box paddingX="lg">
            {activeView === CALENDAR_VIEW.month ? (
              <CalendarMonthView months={months} />
            ) : (
              <CalendarYearPlaceholder />
            )}
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default CalendarScreen;
