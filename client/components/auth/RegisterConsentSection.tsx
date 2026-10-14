import { useRouter } from 'expo-router';

import { RegisterConsentOption } from '@/components/auth/RegisterConsentOption';
import { Box, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

export type RegisterConsentSectionProps = {
  acceptedPrivacy: boolean;
  wantsNewsletter: boolean;
  onTogglePrivacy: () => void;
  onToggleNewsletter: () => void;
};

export const RegisterConsentSection = ({
  acceptedPrivacy,
  wantsNewsletter,
  onTogglePrivacy,
  onToggleNewsletter,
}: RegisterConsentSectionProps) => {
  const { t } = useTranslate();
  const router = useRouter();

  const openPrivacyPolicy = () => {
    router.push(ROUTES.legal.privacyPolicy);
  };

  const labelColor = (isSelected: boolean) =>
    isSelected ? semanticColors.card : semanticColors.ink2;

  return (
    <Box gap="sm" className="mt-4">
      <RegisterConsentOption
        isSelected={acceptedPrivacy}
        onToggle={onTogglePrivacy}
        accessibilityLabel={t('register_privacy_consent_accessibility')}
      >
        <Text size="sm" weight="medium" className="leading-relaxed" style={{ color: labelColor(acceptedPrivacy) }}>
          {t('register_privacy_consent_before')}
          <Text
            size="sm"
            weight="semibold"
            accessibilityRole="link"
            onPress={openPrivacyPolicy}
            className="underline"
            style={{ color: labelColor(acceptedPrivacy) }}
          >
            {t('register_privacy_consent_link')}
          </Text>
          {t('register_privacy_consent_after')}
        </Text>
      </RegisterConsentOption>

      <RegisterConsentOption
        isSelected={wantsNewsletter}
        onToggle={onToggleNewsletter}
        accessibilityLabel={t('register_newsletter_consent')}
      >
        <Text size="sm" weight="medium" className="leading-relaxed" style={{ color: labelColor(wantsNewsletter) }}>
          {t('register_newsletter_consent')}
        </Text>
      </RegisterConsentOption>
    </Box>
  );
};
