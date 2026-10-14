import { useCallback, useState } from 'react';

import { BirthDatePickerSheet } from '@/components/profile/BirthDatePickerSheet';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  getMaxBirthDateIso,
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';
import { formatBirthDate } from '@/lib/profile/formatBirthDate';
import { borderColorClasses, cn, radiusClasses } from '@/lib/ui';

export type BirthDateFieldProps = {
  value: string;
  onChange: (isoDate: string) => void;
  label: string;
  placeholder?: string;
  errorMessage?: string;
};

/**
 * Shared DOB field: shows day/month/year, opens the full date wheel on press.
 * Used by onboarding/create-account and profile personal editing.
 */
export const BirthDateField = ({
  value,
  onChange,
  label,
  placeholder,
  errorMessage,
}: BirthDateFieldProps) => {
  const { t, language } = useTranslate();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(getMaxBirthDateIso());
  const [isDraftValid, setIsDraftValid] = useState(true);

  const openPicker = useCallback(() => {
    const nextDraft = value || getMaxBirthDateIso();
    setDraftDate(nextDraft);
    const parsed = parseIsoDate(nextDraft);
    setIsDraftValid(parsed ? isAtLeastMinAge(parsed) : false);
    setIsPickerOpen(true);
  }, [value]);

  const closePicker = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  const displayDate = formatBirthDate(value, language);
  const hasValue = Boolean(displayDate);
  const resolvedPlaceholder =
    placeholder ?? t('bio_details_date_of_birth_placeholder');

  return (
    <>
      <Box className="w-full">
        <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
          {label}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={openPicker}
          className={cn(
            'w-full border bg-white/90 px-4 py-3.5',
            radiusClasses.xl,
            errorMessage
              ? borderColorClasses.error
              : borderColorClasses['foreground-muted'],
          )}>
          <Text size="base" color={hasValue ? 'foreground' : 'foreground-muted'}>
            {hasValue ? displayDate : resolvedPlaceholder}
          </Text>
        </TouchableOpacity>
        {errorMessage ? (
          <Text size="xs" color="error" className="mt-1.5">
            {errorMessage}
          </Text>
        ) : null}
      </Box>

      <BirthDatePickerSheet
        visible={isPickerOpen}
        title={label}
        value={draftDate}
        onChange={(next) => {
          setDraftDate(next);
          const parsed = parseIsoDate(next);
          setIsDraftValid(parsed ? isAtLeastMinAge(parsed) : false);
        }}
        onCancel={closePicker}
        saveDisabled={!isDraftValid}
        onSave={() => {
          onChange(draftDate);
          closePicker();
        }}
      />
    </>
  );
};
