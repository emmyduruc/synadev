import { Box, Text } from '@/components/ui';

export type AuthHeroProps = {
  headline: string;
  subtitle?: string;
  /** Extra body paragraphs under the headline (preferred for multi-line register copy). */
  bodyLines?: readonly string[];
  align?: 'left' | 'center';
};

export const AuthHero = ({
  headline,
  subtitle,
  bodyLines,
  align = 'center',
}: AuthHeroProps) => (
  <Box gap="sm" className="mb-8 mt-2">
    <Text size="3xl" weight="bold" align={align} className="leading-tight text-foreground">
      {headline}
    </Text>
    {bodyLines?.map((line) => (
      <Text
        key={line}
        size="sm"
        color="foreground"
        align={align}
        className="leading-relaxed"
      >
        {line}
      </Text>
    ))}
    {subtitle ? (
      <Text size="base" color="foreground-muted" align={align} className="leading-relaxed">
        {subtitle}
      </Text>
    ) : null}
  </Box>
);
