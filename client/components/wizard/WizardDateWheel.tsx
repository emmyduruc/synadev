import { DatePicker } from '@quidone/react-native-wheel-picker';
import { useCallback, useEffect, useMemo } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import {
  clampIsoDate,
  getDatePickerLocale,
  getMaxBirthDateIso,
  getMinBirthDateIso,
  isAtLeastMinAge,
  parseIsoDate,
} from '@/lib/profile/bioDataValidation';
import {
  WHEEL_PICKER_HEIGHT,
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_VISIBLE_ITEM_COUNT,
  wheelPickerItemTextStyle,
  wheelPickerSelectionOverlayStyle,
} from '@/lib/wizard/wheelPickerNativeStyles';

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
    <Box fullWidth gap="md">
      <Text size="sm" color="foreground-muted" align="center">
        {t('wizard_date_of_birth_age_hint')}
      </Text>

      <Box
        fullWidth
        align="center"
        justify="center"
        className="overflow-hidden rounded-2xl"
        style={{ height: WHEEL_PICKER_HEIGHT }}>
        <DatePicker
          date={pickerDate}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
          onDateChanged={handleDateChanged}
          itemHeight={WHEEL_PICKER_ITEM_HEIGHT}
          visibleItemCount={WHEEL_PICKER_VISIBLE_ITEM_COUNT}
          enableScrollByTapOnItem
          overlayItemStyle={wheelPickerSelectionOverlayStyle}
          itemTextStyle={wheelPickerItemTextStyle}
          renderDate={() => <DatePicker.Date width={DATE_COLUMN_WIDTH} />}
          renderMonth={() => <DatePicker.Month width={MONTH_COLUMN_WIDTH} />}
          renderYear={() => <DatePicker.Year width={YEAR_COLUMN_WIDTH} />}
        />
      </Box>
    </Box>
  );
};
