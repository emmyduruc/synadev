import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { UserReportFactPill } from '@/lib/report/userReportTypes';

export type UserReportFactsBandProps = {
  titleKey: string;
  days: number;
  pills: readonly UserReportFactPill[];
};

export const UserReportFactsBand = ({
  titleKey,
  days,
  pills,
}: UserReportFactsBandProps) => {
  const { t } = useTranslate();

  if (pills.length === 0) {
    return null;
  }

  return (
    <Box gap="md" className="rounded-2xl bg-primary-50 px-4 py-5">
      <Text size="2xs" weight="semibold" color="primary" className="tracking-widest">
        {t(titleKey, { days })}
      </Text>
      <Box direction="row" className="flex-wrap gap-2">
        {pills.map((pill) => (
          <Box
            key={pill.id}
            className="rounded-full border border-white/80 bg-card px-3 py-2">
            <Text size="xs" weight="medium" className="leading-snug text-black">
              {t(pill.labelKey, pill.params)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
