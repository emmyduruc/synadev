import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslate } from '@/hooks/useTranslate';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  birthYearFromIsoDate,
  isoDateFromBirthYear,
  isValidBirthYear,
  parseBirthYearInput,
} from '@/lib/profile/birthYear';
import { toast } from '@/lib/sonner';

const createBioDetailsSchema = (messages: {
  firstNameRequired: string;
  lastNameRequired: string;
  yearRequired: string;
  yearInvalid: string;
  yearAge: string;
}) =>
  z.object({
    firstName: z.string().trim().min(1, messages.firstNameRequired).max(100),
    lastName: z.string().trim().min(1, messages.lastNameRequired).max(100),
    yearOfBirth: z
      .string()
      .trim()
      .min(1, messages.yearRequired)
      .superRefine((value, context) => {
        const year = parseBirthYearInput(value);

        if (year === null) {
          context.addIssue({ code: 'custom', message: messages.yearInvalid });
          return;
        }

        if (!isValidBirthYear(year)) {
          context.addIssue({ code: 'custom', message: messages.yearAge });
        }
      }),
  });

export type BioDetailsFormValues = {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
};

export type UseBioDetailsFormOptions = {
  initialBioData: BioData;
  onComplete: (bioData: BioData) => void | Promise<void>;
};

export const useBioDetailsForm = ({
  initialBioData,
  onComplete,
}: UseBioDetailsFormOptions) => {
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      createBioDetailsSchema({
        firstNameRequired: t('bio_details_first_name_required'),
        lastNameRequired: t('bio_details_last_name_required'),
        yearRequired: t('bio_details_year_required'),
        yearInvalid: t('bio_details_year_invalid'),
        yearAge: t('wizard_bio_age_requirement_error'),
      }),
    [t],
  );

  const { control, handleSubmit } = useForm<BioDetailsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialBioData.firstName,
      lastName: initialBioData.lastName,
      yearOfBirth: birthYearFromIsoDate(initialBioData.dateOfBirth),
    },
  });

  const submit = useCallback(() => {
    void handleSubmit(async ({ firstName, lastName, yearOfBirth }) => {
      const year = parseBirthYearInput(yearOfBirth);

      if (year === null) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onComplete({
          ...initialBioData,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: isoDateFromBirthYear(year),
        });
      } catch {
        toast.error(t('bio_details_save_error'));
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [handleSubmit, initialBioData, onComplete, t]);

  return {
    control,
    isSubmitting,
    submit,
  };
};
