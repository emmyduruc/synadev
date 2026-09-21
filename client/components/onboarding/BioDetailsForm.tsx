import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { AuthHero } from '@/components/auth/AuthHero';
import { Box, Button, FormField, Text } from '@/components/ui';
import { useBioDetailsForm } from '@/hooks/useBioDetailsForm';
import { useTranslate } from '@/hooks/useTranslate';
import { AUTH_HEADLINE_FONT_SIZE_PX } from '@/lib/auth/constants';
import type { BioData } from '@/lib/profile/bioDataStorage';
import { ROUTES } from '@/lib/routes';

export type BioDetailsFormProps = {
  initialBioData: BioData;
  onComplete: (bioData: BioData) => void | Promise<void>;
};

export const BioDetailsForm = ({ initialBioData, onComplete }: BioDetailsFormProps) => {
  const { t } = useTranslate();
  const { control, isSubmitting, submit } = useBioDetailsForm({
    initialBioData,
    onComplete,
  });

  return (
    <AuthGradientLayout
      header={{ title: '', fallbackHref: ROUTES.welcome }}
      footer={(
        <Box paddingX="lg">
          <Button fullWidth size="lg" loading={isSubmitting} onPress={submit}>
            {t('bio_details_further_button')}
          </Button>
        </Box>
      )}
    >
      <AuthHero
        align="left"
        headline={t('bio_details_headline')}
        headlineWeight="semibold"
        headlineFontSizePx={AUTH_HEADLINE_FONT_SIZE_PX}
        bodyLines={[t('bio_details_body')]}
      />

      <Box gap="md">
        <FormField
          control={control}
          name="firstName"
          label={t('bio_details_first_name_label')}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
        />
        <FormField
          control={control}
          name="lastName"
          label={t('bio_details_last_name_label')}
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          returnKeyType="next"
        />
        <FormField
          control={control}
          name="yearOfBirth"
          label={t('bio_details_year_of_birth_label')}
          placeholder={t('bio_details_year_of_birth_placeholder')}
          keyboardType="number-pad"
          maxLength={4}
          returnKeyType="done"
          onSubmitEditing={submit}
        />

        <Text size="sm" color="foreground-muted" className="mt-1">
          {t('bio_details_profile_note')}
        </Text>
      </Box>
    </AuthGradientLayout>
  );
};
