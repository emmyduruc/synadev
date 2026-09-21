import { useCallback, useState } from 'react';
import { Controller, type Control } from 'react-hook-form';

import { ProfileSettingsEditSheet } from '@/components/profile/ProfileSettingsEditSheet';
import { Box, Text, TouchableOpacity } from '@/components/ui';
import { WizardDateWheel } from '@/components/wizard/WizardDateWheel';
import type { BioDetailsFormValues } from '@/hooks/useBioDetailsForm';
import { useTranslate } from '@/hooks/useTranslate';
import {
  getMaxBirthDateIso,
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';
import { birthYearFromIsoDate } from '@/lib/profile/birthYear';
import { borderColorClasses, cn, radiusClasses } from '@/lib/ui';

export type BioBirthDateFieldProps = {
  control: Control<BioDetailsFormValues>;
};

export const BioBirthDateField = ({ control }: BioBirthDateFieldProps) => {
  const { t } = useTranslate();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(getMaxBirthDateIso());
  const [isDraftValid, setIsDraftValid] = useState(true);

  const openPicker = useCallback((currentValue: string) => {
    const nextDraft = currentValue || getMaxBirthDateIso();
    setDraftDate(nextDraft);
    const parsed = parseIsoDate(nextDraft);
    setIsDraftValid(parsed ? isAtLeastMinAge(parsed) : false);
    setIsPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  return (
    <Controller
      control={control}
      name="dateOfBirth"
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const displayYear = birthYearFromIsoDate(value);
        const hasValue = Boolean(displayYear);

        return (
          <>
            <Box className="w-full">
              <Text size="sm" weight="medium" color="foreground" className="mb-1.5">
                {t('bio_details_year_of_birth_label')}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('bio_details_year_of_birth_label')}
                onPress={() => openPicker(value)}
                className={cn(
                  'w-full border bg-white/90 px-4 py-3.5',
                  radiusClasses.xl,
                  error ? borderColorClasses.error : borderColorClasses['foreground-muted'],
                )}
              >
                <Text size="base" color={hasValue ? 'foreground' : 'foreground-muted'}>
                  {hasValue ? displayYear : t('bio_details_year_of_birth_placeholder')}
                </Text>
              </TouchableOpacity>
              {error?.message ? (
                <Text size="xs" color="error" className="mt-1.5">
                  {error.message}
                </Text>
              ) : null}
            </Box>

            <ProfileSettingsEditSheet
              visible={isPickerOpen}
              title={t('bio_details_year_of_birth_label')}
              onCancel={closePicker}
              saveDisabled={!isDraftValid}
              onSave={() => {
                onChange(draftDate);
                closePicker();
              }}
            >
              <WizardDateWheel
                value={draftDate}
                onChange={setDraftDate}
                onValidityChange={setIsDraftValid}
              />
            </ProfileSettingsEditSheet>
          </>
        );
      }}
    />
  );
};
