import { Box, Text } from '@/components/ui';
import type { FontWeight, TextAlign } from '@/lib/ui';
import { SCREEN_HEADLINE_FONT_SIZE_PX } from '@/lib/ui/typography';

export type ScreenHeroProps = {
  headline: string;
  subtitle?: string;
  /** Extra body paragraphs under the headline. */
  bodyLines?: readonly string[];
  align?: TextAlign;
  headlineWeight?: FontWeight;
  /** Override default shared headline size (25px). */
  headlineFontSizePx?: number;
  className?: string;
};

/**
 * Shared screen headline used across auth and onboarding (25px semibold by default).
 */
export const ScreenHero = ({
  headline,
  subtitle,
  bodyLines,
  align = 'left',
  headlineWeight = 'semibold',
  headlineFontSizePx = SCREEN_HEADLINE_FONT_SIZE_PX,
  className = 'mb-6 mt-2',
}: ScreenHeroProps) => (
  <Box gap="sm" className={className}>
    <Text
      size="2xl"
      weight={headlineWeight}
      align={align}
      responsive={false}
      className="leading-tight text-foreground"
      style={{ fontSize: headlineFontSizePx }}
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
      <Text size="base" color="foreground" align={align} className="leading-relaxed">
        {subtitle}
      </Text>
    ) : null}
  </Box>
);
