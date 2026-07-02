import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { TextInput } from '@/components/ui/TextInput';
import type { TextInputProps } from '@/components/ui/TextInput';

type FormFieldProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'errorMessage'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export const FormField = <T extends FieldValues>({
  control,
  name,
  ...props
}: FormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextInput
        {...props}
        value={value}
        onChangeText={onChange}
        errorMessage={error?.message}
      />
    )}
  />
);
