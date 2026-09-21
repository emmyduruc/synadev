import { Box, Text } from '@/components/ui';
import type { FontWeight, TextAlign } from '@/lib/ui';

export type AuthHeroProps = {
  headline: string;
  subtitle?: string;
  /** Extra body paragraphs under the headline (preferred for multi-line register copy). */
  bodyLines?: readonly string[];
  align?: TextAlign;
  headlineWeight?: FontWeight;
  /** Exact headline size in px when the design specifies a non-token size. */
  headlineFontSizePx?: number;
};

export const AuthHero = ({
  headline,
  subtitle,
  bodyLines,
  align = 'center',
  headlineWeight = 'semibold',
  headlineFontSizePx,
}: AuthHeroProps) => (
  <Box gap="sm" className="mb-6 mt-2">
    <Text
      size={headlineFontSizePx ? '2xl' : '3xl'}
      weight={headlineWeight}
      align={align}
      responsive={!headlineFontSizePx}
      className="leading-tight text-foreground"
      style={headlineFontSizePx ? { fontSize: headlineFontSizePx } : undefined}
    >
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
