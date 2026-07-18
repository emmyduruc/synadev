import { ScrollView } from 'react-native';

import { DashboardQuickActionButton } from './DashboardQuickActionButton';

import { Box } from '@/components/ui/Box';
import { BloodDropIcon } from '@/components/ui/icons/BloodDropIcon';
import { MoodIcon } from '@/components/ui/icons/MoodIcon';
import { PeriodIcon } from '@/components/ui/icons/PeriodIcon';
import { SparkleIcon } from '@/components/ui/icons/SparkleIcon';
import { SymptomsIcon } from '@/components/ui/icons/SymptomsIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DASHBOARD_ICON_WELL,
  DASHBOARD_QUICK_ACTION_SURFACE,
  DASHBOARD_SURFACE,
} from '@/lib/dashboard/surfaces';
import { CONFETTI_ACTION } from '@/lib/gamification/confettiActions';
import { cn, semanticColors } from '@/lib/ui';

export type DashboardCheckInCardProps = {
  onCelebrate: (action: (typeof CONFETTI_ACTION)[keyof typeof CONFETTI_ACTION]) => void;
  onRecordPeriod: () => void;
  onEditPeriod: () => void;
  onOpenSymptoms: () => void;
  onOpenMood: () => void;
  embedded?: boolean;
};

export const DashboardCheckInCard = ({
  onCelebrate,
  onRecordPeriod,
  onEditPeriod,
  onOpenSymptoms,
  onOpenMood,
  embedded = false,
}: DashboardCheckInCardProps) => {
  const { t } = useTranslate();

  return (
    <Box
      className={cn(
        embedded ? undefined : cn(DASHBOARD_SURFACE.lavenderShell, 'p-4'),
      )}>
      <Box className={cn(DASHBOARD_SURFACE.nestedLift, 'px-4 py-4')}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => onCelebrate(CONFETTI_ACTION.dailyCheckInCompleted)}>
          <Box direction="row" align="center" gap="md">
            <Box
              align="center"
              justify="center"
              className={cn('h-12 w-12 rounded-full', DASHBOARD_ICON_WELL.sparkle)}>
              <SparkleIcon size={22} color={semanticColors.dashboardIcon.sparkle} />
            </Box>
            <Box flex={1} gap="xs">
              <Text size="base" weight="semibold">
                {t('dashboard_check_in_title')}
              </Text>
              <Text size="xs" color="foreground-muted" className="leading-relaxed">
                {t('dashboard_check_in_subtitle')}
              </Text>
            </Box>
          </Box>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
          <DashboardQuickActionButton
            label={t('dashboard_quick_action_record_period')}
            icon={
              <BloodDropIcon size={22} color={semanticColors.dashboardIcon.recordPeriod} />
            }
            iconWellClassName={DASHBOARD_ICON_WELL.recordPeriod}
            surfaceClassName={DASHBOARD_QUICK_ACTION_SURFACE.recordPeriod}
            onPress={onRecordPeriod}
          />
          <DashboardQuickActionButton
            label={t('dashboard_quick_action_period')}
            icon={<PeriodIcon size={22} color={semanticColors.dashboardIcon.period} />}
            iconWellClassName={DASHBOARD_ICON_WELL.period}
            surfaceClassName={DASHBOARD_QUICK_ACTION_SURFACE.period}
            onPress={onEditPeriod}
          />
          <DashboardQuickActionButton
            label={t('dashboard_quick_action_symptoms')}
            icon={<SymptomsIcon size={22} color={semanticColors.dashboardIcon.onLavender} />}
            iconWellClassName={DASHBOARD_ICON_WELL.symptoms}
            surfaceClassName={DASHBOARD_QUICK_ACTION_SURFACE.symptoms}
            onPress={onOpenSymptoms}
          />
          <DashboardQuickActionButton
            label={t('dashboard_quick_action_mood')}
            icon={<MoodIcon size={22} color={semanticColors.dashboardIcon.onApricot} />}
            iconWellClassName={DASHBOARD_ICON_WELL.mood}
            surfaceClassName={DASHBOARD_QUICK_ACTION_SURFACE.mood}
            onPress={onOpenMood}
          />
        </ScrollView>
      </Box>
    </Box>
  );
};
