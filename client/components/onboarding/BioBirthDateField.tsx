import { Controller, type Control } from 'react-hook-form';

import { BirthDateField } from '@/components/profile/BirthDateField';
import type { BioDetailsFormValues } from '@/hooks/useBioDetailsForm';
import { useTranslate } from '@/hooks/useTranslate';

export type BioBirthDateFieldProps = {
  control: Control<BioDetailsFormValues>;
};

export const BioBirthDateField = ({ control }: BioBirthDateFieldProps) => {
  const { t } = useTranslate();

  return (
    <Controller
      control={control}
      name="dateOfBirth"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <BirthDateField
          value={value}
          onChange={onChange}
          label={t('bio_details_date_of_birth_label')}
          placeholder={t('bio_details_date_of_birth_placeholder')}
          errorMessage={error?.message}
        />
      )}
    />
  );
};
