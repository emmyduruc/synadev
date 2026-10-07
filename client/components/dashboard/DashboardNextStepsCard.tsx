import { DashboardListRow } from '@/components/dashboard/DashboardListRow';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DashboardNextStepsCardProps = {
  onPressFirstEntry?: () => void;
  onPressMrsIi?: () => void;
  onPressCompleteProfile?: () => void;
};

const noop = () => undefined;

export const DashboardNextStepsCard = ({
  onPressFirstEntry = noop,
  onPressMrsIi = noop,
  onPressCompleteProfile = noop,
}: DashboardNextStepsCardProps) => {
  const { t } = useTranslate();

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card px-5 pt-5 pb-1">
      <Text size="base" weight="bold" family="serif" className="mb-1 leading-tight">
        {t('dashboard_next_steps_title')}
      </Text>

      <DashboardListRow
        title={t('dashboard_next_steps_first_entry_title')}
        subtitle={t('dashboard_next_steps_first_entry_body')}
        onPress={onPressFirstEntry}
      />
      <DashboardListRow
        title={t('dashboard_next_steps_mrs_title')}
        subtitle={t('dashboard_next_steps_mrs_body')}
        onPress={onPressMrsIi}
      />
      <DashboardListRow
        title={t('dashboard_next_steps_profile_title')}
        subtitle={t('dashboard_next_steps_profile_body')}
        onPress={onPressCompleteProfile}
        showDivider={false}
      />
    </Box>
  );
};
