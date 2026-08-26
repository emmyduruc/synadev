import { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReportDateRangeDayGrid } from '@/components/report/ReportDateRangeDayGrid';
import { ReportDateRangeMonthPicker } from '@/components/report/ReportDateRangeMonthPicker';
import { ReportDateRangeYearPicker } from '@/components/report/ReportDateRangeYearPicker';
import { Box } from '@/components/ui/Box';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import { fromDateKey } from '@/lib/date/dateKeys';
import {
  REPORT_RANGE_PICKER_STEP,
  clampReportDateRange,
  formatReportDateKey,
  type ReportDateRange,
  type ReportDateRangeBounds,
  type ReportRangePickerStep,
} from '@/lib/report/reportDateRange';
import { semanticColors } from '@/lib/ui';

export type ReportDateRangeSheetProps = {
  visible: boolean;
  initialRange: ReportDateRange;
  bounds: ReportDateRangeBounds;
  onCancel: () => void;
  onApply: (range: ReportDateRange) => void;
  onReset: () => void;
};

const buildYearList = (bounds: ReportDateRangeBounds): number[] => {
  const minYear = fromDateKey(bounds.minDateKey).getFullYear();
  const maxYear = fromDateKey(bounds.maxDateKey).getFullYear();
  const years: number[] = [];

  for (let year = maxYear; year >= minYear; year -= 1) {
    years.push(year);
  }

  return years;
};

const buildEnabledMonths = (
  year: number,
  bounds: ReportDateRangeBounds,
): Set<number> => {
  const enabled = new Set<number>();
  const min = fromDateKey(bounds.minDateKey);
  const max = fromDateKey(bounds.maxDateKey);

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);

    if (monthEnd < min || monthStart > max) {
      continue;
    }

    enabled.add(monthIndex);
  }

  return enabled;
};

export const ReportDateRangeSheet = ({
  visible,
  initialRange,
  bounds,
  onCancel,
  onApply,
  onReset,
}: ReportDateRangeSheetProps) => {
  const { t } = useTranslate();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();
  const [step, setStep] = useState<ReportRangePickerStep>(REPORT_RANGE_PICKER_STEP.day);
  const [draftFrom, setDraftFrom] = useState(initialRange.fromDateKey);
  const [draftTo, setDraftTo] = useState(initialRange.toDateKey);
  const [pickingEnd, setPickingEnd] = useState(false);
  const [viewYear, setViewYear] = useState(
    fromDateKey(initialRange.toDateKey).getFullYear(),
  );
  const [viewMonthIndex, setViewMonthIndex] = useState(
    fromDateKey(initialRange.toDateKey).getMonth(),
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftFrom(initialRange.fromDateKey);
    setDraftTo(initialRange.toDateKey);
    setPickingEnd(false);
    setStep(REPORT_RANGE_PICKER_STEP.day);
    setViewYear(fromDateKey(initialRange.toDateKey).getFullYear());
    setViewMonthIndex(fromDateKey(initialRange.toDateKey).getMonth());
  }, [initialRange, visible]);

  const years = useMemo(() => buildYearList(bounds), [bounds]);
  const enabledMonths = useMemo(
    () => buildEnabledMonths(viewYear, bounds),
    [bounds, viewYear],
  );

  const draftRange: Partial<ReportDateRange> = pickingEnd
    ? { fromDateKey: draftFrom }
    : { fromDateKey: draftFrom, toDateKey: draftTo };

  const canApply = Boolean(draftFrom && draftTo && draftFrom <= draftTo);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonthIndex + delta, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth();
    const nextEnabled = buildEnabledMonths(nextYear, bounds);

    if (!nextEnabled.has(nextMonth)) {
      return;
    }

    setViewYear(nextYear);
    setViewMonthIndex(nextMonth);
  };

  const handleSelectDate = (dateKey: string) => {
    if (!pickingEnd || dateKey < draftFrom) {
      setDraftFrom(dateKey);
      setDraftTo(dateKey);
      setPickingEnd(true);
      return;
    }

    setDraftTo(dateKey);
    setPickingEnd(false);
  };

  const handleApply = () => {
    if (!canApply) {
      return;
    }

    onApply(
      clampReportDateRange(
        { fromDateKey: draftFrom, toDateKey: draftTo },
        bounds,
      ),
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}>
      <Box flex={1} background="background" style={{ paddingTop: safeAreaTop }}>
        <Box align="center" paddingX="lg" className="pt-4 pb-2" gap="xs">
          <Text size="lg" weight="bold" align="center" className="text-black">
            {t('report_date_range_title')}
          </Text>
          <Text size="xs" align="center" className="text-black/60">
            {t('report_date_range_subtitle')}
          </Text>
        </Box>

        <Box paddingX="lg" className="pb-3" gap="sm">
          <Box direction="row" gap="sm">
            <Box
              flex={1}
              className="rounded-2xl border border-border bg-card px-3 py-3">
              <Text size="2xs" className="mb-1 text-black/50">
                {t('report_date_range_start_label')}
              </Text>
              <Text size="sm" weight="semibold" className="text-black">
                {formatReportDateKey(draftFrom)}
              </Text>
            </Box>
            <Box
              flex={1}
              className="rounded-2xl border border-border bg-card px-3 py-3">
              <Text size="2xs" className="mb-1 text-black/50">
                {t('report_date_range_end_label')}
              </Text>
              <Text size="sm" weight="semibold" className="text-black">
                {pickingEnd
                  ? t('report_date_range_pick_end')
                  : formatReportDateKey(draftTo)}
              </Text>
            </Box>
          </Box>

          <Text size="2xs" className="text-black/50">
            {t('report_date_range_bounds_hint', {
              from: formatReportDateKey(bounds.minDateKey),
              to: formatReportDateKey(bounds.maxDateKey),
            })}
          </Text>
        </Box>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <Box paddingX="lg" gap="lg">
            {step === REPORT_RANGE_PICKER_STEP.year ? (
              <ReportDateRangeYearPicker
                years={years}
                selectedYear={viewYear}
                onSelectYear={(year) => {
                  setViewYear(year);
                  setStep(REPORT_RANGE_PICKER_STEP.month);
                }}
              />
            ) : null}

            {step === REPORT_RANGE_PICKER_STEP.month ? (
              <ReportDateRangeMonthPicker
                year={viewYear}
                selectedMonthIndex={viewMonthIndex}
                enabledMonthIndexes={enabledMonths}
                onSelectMonth={(monthIndex) => {
                  setViewMonthIndex(monthIndex);
                  setStep(REPORT_RANGE_PICKER_STEP.day);
                }}
              />
            ) : null}

            {step === REPORT_RANGE_PICKER_STEP.day ? (
              <Box gap="md" className="rounded-3xl border border-border bg-card px-3 py-4">
                <Box direction="row" align="center" justify="between">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('report_date_range_prev_month')}
                    onPress={() => shiftMonth(-1)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <ChevronLeftIcon size={18} color={semanticColors.foreground} />
                  </TouchableOpacity>

                  <Box direction="row" align="center" gap="sm">
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => setStep(REPORT_RANGE_PICKER_STEP.month)}
                      className="rounded-full bg-primary-50 px-3 py-2">
                      <Text size="sm" weight="semibold" className="text-primary">
                        {t(`calendar_month_${viewMonthIndex + 1}`)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => setStep(REPORT_RANGE_PICKER_STEP.year)}
                      className="rounded-full bg-lavender-light px-3 py-2">
                      <Text size="sm" weight="semibold" className="text-black">
                        {viewYear}
                      </Text>
                    </TouchableOpacity>
                  </Box>

                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('report_date_range_next_month')}
                    onPress={() => shiftMonth(1)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <ChevronRightIcon size={18} color={semanticColors.foreground} />
                  </TouchableOpacity>
                </Box>

                <ReportDateRangeDayGrid
                  year={viewYear}
                  monthIndex={viewMonthIndex}
                  draftRange={draftRange}
                  bounds={bounds}
                  onSelectDate={handleSelectDate}
                />

                <Text size="2xs" align="center" className="text-black/50">
                  {pickingEnd
                    ? t('report_date_range_select_end_hint')
                    : t('report_date_range_select_start_hint')}
                </Text>
              </Box>
            ) : null}

            {step !== REPORT_RANGE_PICKER_STEP.day ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setStep(REPORT_RANGE_PICKER_STEP.day)}
                className="items-center py-2">
                <Text size="sm" weight="medium" color="primary">
                  {t('report_date_range_back_to_days')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              onPress={onReset}
              className="items-center rounded-2xl border border-border bg-card py-3">
              <Text size="sm" weight="medium" className="text-black">
                {t('report_date_range_reset')}
              </Text>
            </TouchableOpacity>
          </Box>
        </ScrollView>

        <Box style={{ paddingBottom: safeAreaBottom }}>
          <ModalCancelSaveFooter
            onCancel={onCancel}
            onSave={handleApply}
            saveDisabled={!canApply || pickingEnd}
            cancelLabelKey="report_date_range_cancel"
            saveLabelKey="report_date_range_apply"
          />
        </Box>
      </Box>
    </Modal>
  );
};
