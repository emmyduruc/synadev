import { TextInput as RNTextInput } from 'react-native';

import { FONT_FAMILY } from '@/lib/fonts/constants';
import { semanticColors } from '@/lib/ui';

export type DailyLogNoteFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export const DailyLogNoteField = ({
  value,
  onChangeText,
  placeholder,
}: DailyLogNoteFieldProps) => (
  <RNTextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={semanticColors.placeholder}
    multiline
    textAlignVertical="top"
    className="min-h-24 rounded-2xl border border-white bg-card px-4 py-3 font-sans text-base text-foreground"
    style={{ fontFamily: FONT_FAMILY.regular }}
  />
);
