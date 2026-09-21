import { useRouter } from 'expo-router';

import { Avatar, AVATAR_SIZE, AVATAR_VARIANT } from '@/components/ui/Avatar';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  getTimeOfDay,
  TIME_OF_DAY_GREETING_KEY,
} from '@/lib/dashboard/timeOfDayGreeting';
import { formatTodayLongDisplayDate } from '@/lib/date/formatDisplayDate';
import { ROUTES } from '@/lib/routes';

export type DashboardGreetingSectionProps = {
  firstName: string;
  lastName?: string;
};

const initialsFromName = (firstName: string, lastName: string): string => {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);

  if (first && last) {
    return `${first}${last}`;
  }

  if (first) {
    return first;
  }

  return 'S';
};

export const DashboardGreetingSection = ({
  firstName,
  lastName = '',
}: DashboardGreetingSectionProps) => {
  const router = useRouter();
  const { t } = useTranslate();
  const trimmedName = firstName.trim();
  const greetingName = trimmedName.length > 0 ? trimmedName : t('dashboard_greeting_fallback_name');
  const greetingKey = TIME_OF_DAY_GREETING_KEY[getTimeOfDay()];
  const initials = initialsFromName(firstName, lastName);

  return (
    <Box direction="row" align="start" justify="between" gap="md">
      <Box flex={1} gap="xs">
        <Text size="base" weight="medium" className="leading-snug">
          {t(greetingKey, { firstName: greetingName })}
        </Text>
        <Text size="xl" weight="semibold" className="leading-tight">
          {formatTodayLongDisplayDate()}
        </Text>
      </Box>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('dashboard_open_profile_accessibility_label')}
        onPress={() => router.push(ROUTES.tabs.profile)}
      >
        <Avatar
          initials={initials}
          size={AVATAR_SIZE.md}
          variant={AVATAR_VARIANT.neutral}
        />
      </TouchableOpacity>
    </Box>
  );
};
