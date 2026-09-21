import { AuthGradientLayout } from '@/components/auth/AuthGradientLayout';
import { Box, Button, FormField, ScreenHero, Text } from '@/components/ui';
import { useBioDetailsForm } from '@/hooks/useBioDetailsForm';
import { useTranslate } from '@/hooks/useTranslate';
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
      <ScreenHero
        headline={t('bio_details_headline')}
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
