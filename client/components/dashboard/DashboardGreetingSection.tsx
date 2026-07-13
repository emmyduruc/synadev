import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type DashboardGreetingSectionProps = {
  firstName: string;
};

export const DashboardGreetingSection = ({ firstName }: DashboardGreetingSectionProps) => {
  const { t } = useTranslate();
  const trimmedName = firstName.trim();
  const greetingName = trimmedName.length > 0 ? trimmedName : t('dashboard_greeting_fallback_name');

  return (
    <Box gap="sm">
      <Text size="2xl" weight="bold" className="leading-tight">
        {t('dashboard_greeting_title', { firstName: greetingName })}
      </Text>
      <Text size="sm" weight="semibold" className="leading-snug">
        {t('dashboard_greeting_tagline')}
      </Text>
      <Text size="xs" className="leading-relaxed text-black">
        {t('dashboard_greeting_description')}
      </Text>
    </Box>
  );
};
