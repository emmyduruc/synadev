import {
  PERIOD_BLEEDING_TYPES,
  PERIOD_OBSERVATION,
  PERIOD_OBSERVATIONS,
  PERIOD_STRENGTHS,
  type PeriodObservation,
} from '@syna/shared-types';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { toDateKey } from '@/lib/date/dateKeys';
import { formatTodayDisplayDate } from '@/lib/date/formatDisplayDate';
import {
  EMPTY_PERIOD_BLEEDING_DETAILS,
  PERIOD_BLEEDING_TYPE_LABEL_KEYS,
  PERIOD_OBSERVATION_LABEL_KEYS,
  PERIOD_STRENGTH_LABEL_KEYS,
  type PeriodBleedingDetails,
} from '@/lib/period/periodBleedingConstants';
import { cn } from '@/lib/ui';

export type PeriodBleedingFormProps = {
  dateKey: string;
  /** `null` means unanswered (neither Yes nor No selected). */
  isBleeding: boolean | null;
  details: PeriodBleedingDetails;
  disabled?: boolean;
  onChangeBleeding: (isBleeding: boolean) => void;
  onChangeDetails: (details: PeriodBleedingDetails) => void;
};

const optionClassName = (isSelected: boolean) =>
  cn(
    'items-center justify-center rounded-2xl border px-3 py-3.5',
    isSelected
      ? 'border-2 border-foreground bg-muted'
      : 'border border-border bg-card',
  );

export const PeriodBleedingForm = ({
  dateKey,
  isBleeding,
  details,
  disabled = false,
  onChangeBleeding,
  onChangeDetails,
}: PeriodBleedingFormProps) => {
  const { t } = useTranslate();
  const todayKey = toDateKey(new Date());
  const isToday = dateKey === todayKey;
  const dateLabel = formatTodayDisplayDate(new Date(`${dateKey}T12:00:00`));

  const bleedingTitle = isToday
    ? t('period_bleeding_title_today')
    : t('period_bleeding_title_past', { date: dateLabel });

  const handleBleedingChange = (next: boolean) => {
    onChangeBleeding(next);

    if (!next) {
      onChangeDetails(EMPTY_PERIOD_BLEEDING_DETAILS);
    }
  };

  const toggleObservation = (observation: PeriodObservation) => {
    const current = details.observations;
    let next: PeriodObservation[];

    if (observation === PERIOD_OBSERVATION.none) {
      next = current.includes(PERIOD_OBSERVATION.none)
        ? []
        : [PERIOD_OBSERVATION.none];
    } else if (current.includes(observation)) {
      next = current.filter((item) => item !== observation);
    } else {
      next = [
        ...current.filter((item) => item !== PERIOD_OBSERVATION.none),
        observation,
      ];
    }

    onChangeDetails({ ...details, observations: next });
  };

  return (
    <Box gap="lg">
      <Box className="rounded-2xl border border-border bg-card px-4 py-4" gap="md">
        <Text size="base" weight="bold" family="serif">
          {bleedingTitle}
        </Text>

        <Box direction="row" gap="sm">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{
              selected: isBleeding === true,
              disabled,
            }}
            disabled={disabled}
            onPress={() => handleBleedingChange(true)}
            className={cn('flex-1', optionClassName(isBleeding === true))}>
            <Text size="sm" weight="medium" responsive={false} className="text-center">
              {t('period_bleeding_yes')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{
              selected: isBleeding === false,
              disabled,
            }}
            disabled={disabled}
            onPress={() => handleBleedingChange(false)}
            className={cn('flex-1', optionClassName(isBleeding === false))}>
            <Text size="sm" weight="medium" responsive={false} className="text-center">
              {t('period_bleeding_no')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>

      {isBleeding === true ? (
        <Box gap="lg">
          <Box gap="sm">
            <Text size="base" weight="bold" family="serif">
              {t('period_bleeding_first_day_title')}
            </Text>
            <Box direction="row" gap="sm">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{
                  selected: details.isFirstDay === true,
                  disabled,
                }}
                disabled={disabled}
                onPress={() => onChangeDetails({ ...details, isFirstDay: true })}
                className={cn('flex-1', optionClassName(details.isFirstDay === true))}>
                <Text size="sm" weight="medium" responsive={false} className="text-center">
                  {t('period_bleeding_first_day_yes')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{
                  selected: details.isFirstDay === false,
                  disabled,
                }}
                disabled={disabled}
                onPress={() => onChangeDetails({ ...details, isFirstDay: false })}
                className={cn('flex-1', optionClassName(details.isFirstDay === false))}>
                <Text size="sm" weight="medium" responsive={false} className="text-center">
                  {t('period_bleeding_first_day_no')}
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>

          <Box gap="sm">
            <Text size="base" weight="bold" family="serif">
              {t('period_bleeding_type_title')}
            </Text>
            <Box direction="row" gap="sm">
              {PERIOD_BLEEDING_TYPES.map((type) => {
                const isSelected = details.bleedingType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected, disabled }}
                    disabled={disabled}
                    onPress={() => onChangeDetails({ ...details, bleedingType: type })}
                    className={cn('flex-1', optionClassName(isSelected))}>
                    <Text
                      size="sm"
                      weight="medium"
                      responsive={false}
                      className="text-center">
                      {t(PERIOD_BLEEDING_TYPE_LABEL_KEYS[type])}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>

          <Box gap="sm">
            <Text size="base" weight="bold" family="serif">
              {t('period_bleeding_strength_title')}
            </Text>
            <Box direction="row" gap="sm">
              {PERIOD_STRENGTHS.map((strength) => {
                const isSelected = details.strength === strength;

                return (
                  <TouchableOpacity
                    key={strength}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected, disabled }}
                    disabled={disabled}
                    onPress={() => onChangeDetails({ ...details, strength })}
                    className={cn('flex-1', optionClassName(isSelected))}>
                    <Text
                      size="sm"
                      weight="medium"
                      responsive={false}
                      className="text-center">
                      {t(PERIOD_STRENGTH_LABEL_KEYS[strength])}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>

          <Box gap="sm">
            <Text size="base" weight="bold" family="serif">
              {t('period_bleeding_observations_title')}
            </Text>
            <Box gap="sm">
              {PERIOD_OBSERVATIONS.map((observation) => {
                const isSelected = details.observations.includes(observation);

                return (
                  <TouchableOpacity
                    key={observation}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected, disabled }}
                    disabled={disabled}
                    onPress={() => toggleObservation(observation)}
                    className={cn(
                      'items-start justify-center rounded-full border px-4 py-3.5',
                      isSelected
                        ? 'border-2 border-foreground bg-muted'
                        : 'border border-border bg-card',
                    )}>
                    <Text size="sm" weight="medium" responsive={false}>
                      {t(PERIOD_OBSERVATION_LABEL_KEYS[observation])}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>

          <Box gap="sm">
            <Text size="base" weight="bold" family="serif">
              {t('period_bleeding_notes_title')}
            </Text>
            <TextInput
              value={details.notes}
              onChangeText={(notes) => onChangeDetails({ ...details, notes })}
              placeholder={t('period_bleeding_notes_placeholder')}
              multiline
              disabled={disabled}
            />
          </Box>

          <Box gap="sm">
            <Text size="xs" color="foreground-muted" className="leading-relaxed">
              {t('period_bleeding_notes_disclaimer')}
            </Text>
            <Text size="xs" color="foreground-muted" className="leading-relaxed">
              {t('period_bleeding_history_disclaimer')}
            </Text>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
