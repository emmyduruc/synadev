import { Avatar, AVATAR_BADGE, AVATAR_SIZE, AVATAR_VARIANT } from '@/components/ui/Avatar';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { InsightMedicalReviewer } from '@/lib/insights/insightTypes';

export type InsightMedicalReviewerRowProps = {
  reviewer: InsightMedicalReviewer;
  headingKey: string;
  size?: typeof AVATAR_SIZE.md | typeof AVATAR_SIZE.lg;
};

export const InsightMedicalReviewerRow = ({
  reviewer,
  headingKey,
  size = AVATAR_SIZE.lg,
}: InsightMedicalReviewerRowProps) => {
  const { t } = useTranslate();

  return (
    <Box direction="row" align="center" gap="md">
      <Avatar
        initials={reviewer.initials}
        size={size}
        variant={AVATAR_VARIANT.lavender}
        badge={AVATAR_BADGE.verified}
        accessibilityLabel={t(reviewer.nameKey)}
      />
      <Box flex={1} gap="xs">
        <Text size="2xs" weight="semibold" className="uppercase tracking-wide text-foreground-muted">
          {t(headingKey)}
        </Text>
        <Text size="sm" weight="bold" className="leading-tight">
          {t(reviewer.nameKey)}
        </Text>
        <Text size="2xs" color="foreground-muted" className="leading-relaxed">
          {t(reviewer.roleKey)}
        </Text>
      </Box>
    </Box>
  );
};
