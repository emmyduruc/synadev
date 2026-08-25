import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';

export type UserReportHeroProps = {
  headlineKey: string;
  introKey: string;
};

export const UserReportHero = ({ headlineKey, introKey }: UserReportHeroProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="md">
      <Box className="self-start rounded-full bg-primary-100 px-3 py-1.5">
        <Text size="2xs" weight="semibold" color="primary" className="tracking-widest">
          {t('user_report_eyebrow')}
        </Text>
      </Box>

      <Text size="3xl" weight="bold" className="leading-tight text-black">
        {t(headlineKey)}
      </Text>

      <Text size="sm" className="leading-relaxed text-black">
        {t(introKey)}
      </Text>
    </Box>
  );
};
