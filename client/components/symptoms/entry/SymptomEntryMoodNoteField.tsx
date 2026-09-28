import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';

export type SymptomEntryMoodNoteFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SymptomEntryMoodNoteField = ({
  value,
  onChange,
}: SymptomEntryMoodNoteFieldProps) => {
  const { t } = useTranslate();

  return (
    <Box gap="sm">
      <Text size="sm" weight="bold">
        {t('symptom_entry_mood_note_title')}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t('symptom_entry_mood_note_placeholder')}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        containerClassName="w-full"
        inputClassName="min-h-[110px] py-3"
      />
      <Text size="2xs" color="foreground-muted" className="leading-relaxed">
        {t('symptom_entry_mood_note_disclaimer')}
      </Text>
    </Box>
  );
};
