import { DeepeningMigraineForm } from '@/components/deepening/DeepeningMigraineForm';
import { ProfileEditField } from '@/components/profile/ProfileEditField';
import { ProfileOptionChips } from '@/components/profile/ProfileOptionChips';
import { Box } from '@/components/ui/Box';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DEEPENING_FIELD_INPUT,
  DEEPENING_FIELDS,
  type DeepeningFieldId,
} from '@/lib/deepening/deepeningCatalog';
import type { DeepeningFieldValue } from '@/lib/deepening/deepeningTypes';

export type DeepeningFieldFormProps = {
  fieldId: DeepeningFieldId;
  value: DeepeningFieldValue;
  onChange: (value: DeepeningFieldValue) => void;
};

export const DeepeningFieldForm = ({
  fieldId,
  value,
  onChange,
}: DeepeningFieldFormProps) => {
  const { t } = useTranslate();
  const field = DEEPENING_FIELDS[fieldId];

  if (
    field.inputKind === DEEPENING_FIELD_INPUT.migraine
    && value.kind === DEEPENING_FIELD_INPUT.migraine
  ) {
    return (
      <DeepeningMigraineForm
        value={value.migraine}
        onChange={(migraine) =>
          onChange({ kind: DEEPENING_FIELD_INPUT.migraine, migraine })
        }
      />
    );
  }

  if (
    field.inputKind === DEEPENING_FIELD_INPUT.bloodPressure
    && value.kind === DEEPENING_FIELD_INPUT.bloodPressure
  ) {
    return (
      <Box direction="row" gap="md">
        <Box flex={1}>
          <ProfileEditField label={t('deepening_bp_systolic_label')}>
            <TextInput
              value={value.bloodPressure.systolic}
              onChangeText={(systolic) =>
                onChange({
                  kind: DEEPENING_FIELD_INPUT.bloodPressure,
                  bloodPressure: { ...value.bloodPressure, systolic },
                })
              }
              keyboardType="number-pad"
              placeholder={t('deepening_bp_systolic_placeholder')}
              containerClassName="rounded-full"
              inputClassName="rounded-full bg-muted"
            />
          </ProfileEditField>
        </Box>
        <Box flex={1}>
          <ProfileEditField label={t('deepening_bp_diastolic_label')}>
            <TextInput
              value={value.bloodPressure.diastolic}
              onChangeText={(diastolic) =>
                onChange({
                  kind: DEEPENING_FIELD_INPUT.bloodPressure,
                  bloodPressure: { ...value.bloodPressure, diastolic },
                })
              }
              keyboardType="number-pad"
              placeholder={t('deepening_bp_diastolic_placeholder')}
              containerClassName="rounded-full"
              inputClassName="rounded-full bg-muted"
            />
          </ProfileEditField>
        </Box>
      </Box>
    );
  }

  if (
    field.inputKind === DEEPENING_FIELD_INPUT.text
    && value.kind === DEEPENING_FIELD_INPUT.text
  ) {
    // Sheet title already shows the field name; avoid a duplicate label.
    return (
      <TextInput
        value={value.text}
        onChangeText={(text) =>
          onChange({ kind: DEEPENING_FIELD_INPUT.text, text })
        }
        placeholder={t('deepening_text_placeholder')}
        multiline
        inputClassName="rounded-2xl bg-muted"
      />
    );
  }

  if (
    field.inputKind === DEEPENING_FIELD_INPUT.number
    && value.kind === DEEPENING_FIELD_INPUT.number
  ) {
    return (
      <TextInput
        value={value.amount}
        onChangeText={(amount) =>
          onChange({ kind: DEEPENING_FIELD_INPUT.number, amount })
        }
        keyboardType="number-pad"
        placeholder={t('deepening_number_placeholder')}
        containerClassName="rounded-full"
        inputClassName="rounded-full bg-muted"
      />
    );
  }

  if (
    field.inputKind === DEEPENING_FIELD_INPUT.singleSelect
    && value.kind === DEEPENING_FIELD_INPUT.singleSelect
    && field.optionKeys
    && field.labelKeyByOption
  ) {
    return (
      <ProfileOptionChips
        options={field.optionKeys}
        labelKeys={field.labelKeyByOption}
        value={value.option}
        onChange={(option) =>
          onChange({ kind: DEEPENING_FIELD_INPUT.singleSelect, option })
        }
      />
    );
  }

  return null;
};
