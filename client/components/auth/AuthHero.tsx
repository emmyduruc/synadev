import { Box, Text } from '@/components/ui';

export type AuthHeroProps = {
  headline: string;
  subtitle?: string;
};

export const AuthHero = ({ headline, subtitle }: AuthHeroProps) => (
  <Box gap="sm" className="mb-8 mt-2">
    <Text size="3xl" weight="bold" align="center" className="leading-tight text-foreground">
      {headline}
    </Text>
    {subtitle ? (
      <Text size="base" color="foreground-muted" align="center" className="leading-relaxed">
        {subtitle}
      </Text>
    ) : null}
  </Box>
);
