import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { MRS_II_SUBSCALES } from '@/lib/mrs/mrsIiCatalog';
import { cn } from '@/lib/ui';

export const MenopauseScaleIntro = () => {
  const { t } = useTranslate();

  return (
    <Box gap="lg" paddingX="lg" paddingY="md">
      <Box gap="sm">
        <Text size="2xl" weight="bold" className="leading-tight">
          {t('mrs_ii_intro_title')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('mrs_ii_intro_meta')}
        </Text>
        <Text size="sm" color="foreground" className="leading-relaxed">
          {t('mrs_ii_intro_body')}
        </Text>
      </Box>

      <Box gap="sm">
        <Text size="base" weight="semibold">
          {t('mrs_ii_intro_sections_heading')}
        </Text>
        {MRS_II_SUBSCALES.map((subscale) => (
          <Box
            key={subscale.id}
            gap="xs"
            className={cn('rounded-2xl border p-4', subscale.sectionClassName)}>
            <Text size="sm" weight="semibold">
              {t(subscale.titleKey)}
            </Text>
            <Text size="xs" color="foreground" className="leading-relaxed">
              {t(subscale.subtitleKey)}
            </Text>
          </Box>
        ))}
      </Box>

      <Text size="xs" color="foreground" className="leading-relaxed">
        {t('mrs_ii_intro_disclaimer')}
      </Text>
    </Box>
  );
};
