import { ScrollView } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import type { UserReportChainStep } from '@/lib/report/userReportTypes';

export type UserReportChainProps = {
  steps: readonly UserReportChainStep[];
};

export const UserReportChain = ({ steps }: UserReportChainProps) => {
  const { t } = useTranslate();

  if (steps.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
      {steps.map((step, index) => (
        <Box key={step.id} direction="row" align="center" gap="sm">
          <Box
            className="min-w-36 rounded-2xl border border-border bg-card px-3 py-3"
            gap="xs">
            <Text size="lg">{step.emoji}</Text>
            <Text size="sm" weight="bold" className="leading-snug text-black">
              {t(step.titleKey)}
            </Text>
            <Text size="xs" className="leading-snug text-black/70">
              {t(step.subtitleKey)}
            </Text>
          </Box>
          {index < steps.length - 1 ? (
            <Text size="base" className="text-black/50">
              →
            </Text>
          ) : null}
        </Box>
      ))}
    </ScrollView>
  );
};
