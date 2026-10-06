import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

export type ReportConcernsFreeTextSectionProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export const ReportConcernsFreeTextSection = ({
  value,
  onChangeText,
}: ReportConcernsFreeTextSectionProps) => {
  const { t } = useTranslate();

  return (
    <Box className="pt-4" gap="sm">
      <Text size="sm" weight="bold" color="foreground" className="leading-tight">
        {t('report_concerns_freetext_heading')}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('report_concerns_freetext_placeholder')}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        containerClassName="w-full"
        inputClassName="min-h-[110px] py-3 bg-card"
      />
      <Text size="xs" color="foreground-subtle" className="leading-relaxed">
        {t('report_concerns_freetext_note')}
      </Text>
    </Box>
  );
};
