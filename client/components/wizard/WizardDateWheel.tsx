import { DatePicker } from '@quidone/react-native-wheel-picker';
import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { FONT_FAMILY } from '@/lib/fonts/constants';
import {
  clampIsoDate,
  getDatePickerLocale,
  getMaxBirthDateIso,
  getMinBirthDateIso,
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';
import { semanticColors } from '@/lib/ui';

const PICKER_ITEM_HEIGHT = 48;
const PICKER_VISIBLE_ITEM_COUNT = 5;
const PICKER_HEIGHT = PICKER_ITEM_HEIGHT * PICKER_VISIBLE_ITEM_COUNT;

const DATE_COLUMN_WIDTH = '26%' as `${number}%`;
const MONTH_COLUMN_WIDTH = '48%' as `${number}%`;
const YEAR_COLUMN_WIDTH = '26%' as `${number}%`;

export type WizardDateWheelProps = {
  value: string;
  onChange: (isoDate: string) => void;
  onValidityChange?: (isValid: boolean) => void;
};

export const WizardDateWheel = ({
  value,
  onChange,
  onValidityChange,
}: WizardDateWheelProps) => {
  const { t, language } = useTranslate();

  const minDate = useMemo(() => getMinBirthDateIso(), []);
  const maxDate = useMemo(() => getMaxBirthDateIso(), []);
  const locale = useMemo(() => getDatePickerLocale(language), [language]);

  const pickerDate = useMemo(
    () => clampIsoDate(value || maxDate, minDate, maxDate),
    [maxDate, minDate, value],
  );

  const notifyValidity = useCallback(
    (isoDate: string) => {
      const parsed = parseIsoDate(isoDate);
      onValidityChange?.(parsed ? isAtLeastMinAge(parsed) : false);
    },
    [onValidityChange],
  );

  const handleDateChanged = useCallback(
    ({ date }: { date: string }) => {
      onChange(date);
      notifyValidity(date);
    },
    [notifyValidity, onChange],
  );

  useEffect(() => {
    if (!value) {
      onChange(pickerDate);
    }

    notifyValidity(pickerDate);
  }, [notifyValidity, onChange, pickerDate, value]);

  return (
    <View style={styles.root}>
      <Text size="sm" color="foreground-muted" align="center">
        {t('wizard_date_of_birth_age_hint')}
      </Text>

      <View style={styles.pickerFrame}>
        <DatePicker
          date={pickerDate}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
          onDateChanged={handleDateChanged}
          itemHeight={PICKER_ITEM_HEIGHT}
          visibleItemCount={PICKER_VISIBLE_ITEM_COUNT}
          enableScrollByTapOnItem
          overlayItemStyle={styles.selectionOverlay}
          itemTextStyle={styles.itemText}
          renderDate={() => <DatePicker.Date width={DATE_COLUMN_WIDTH} />}
          renderMonth={() => <DatePicker.Month width={MONTH_COLUMN_WIDTH} />}
          renderYear={() => <DatePicker.Year width={YEAR_COLUMN_WIDTH} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: 16,
  },
  pickerFrame: {
    width: '100%',
    height: PICKER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionOverlay: {
    backgroundColor: semanticColors.codeHighlightLight,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 12,
  },
  itemText: {
    color: semanticColors.foreground,
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 20,
  },
});
