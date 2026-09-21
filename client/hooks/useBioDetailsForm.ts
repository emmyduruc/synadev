import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslate } from '@/hooks/useTranslate';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';
import { toast } from '@/lib/sonner';

const createBioDetailsSchema = (messages: {
  firstNameRequired: string;
  lastNameRequired: string;
  dateRequired: string;
  dateAge: string;
}) =>
  z.object({
    firstName: z.string().trim().min(1, messages.firstNameRequired).max(100),
    lastName: z.string().trim().min(1, messages.lastNameRequired).max(100),
    dateOfBirth: z
      .string()
      .trim()
      .min(1, messages.dateRequired)
      .superRefine((value, context) => {
        const parsed = parseIsoDate(value);

        if (!parsed) {
          context.addIssue({ code: 'custom', message: messages.dateRequired });
          return;
        }

        if (!isAtLeastMinAge(parsed)) {
          context.addIssue({ code: 'custom', message: messages.dateAge });
        }
      }),
  });

export type BioDetailsFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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
        dateRequired: t('bio_details_year_required'),
        dateAge: t('wizard_bio_age_requirement_error'),
      }),
    [t],
  );

  const { control, handleSubmit } = useForm<BioDetailsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialBioData.firstName,
      lastName: initialBioData.lastName,
      dateOfBirth: initialBioData.dateOfBirth,
    },
  });

  const submit = useCallback(() => {
    void handleSubmit(async ({ firstName, lastName, dateOfBirth }) => {
      setIsSubmitting(true);

      try {
        await onComplete({
          ...initialBioData,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth,
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
