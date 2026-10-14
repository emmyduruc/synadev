import { PeriodBleedingForm } from '@/components/period/PeriodBleedingForm';
import type { PeriodBleedingDetails } from '@/lib/period/periodBleedingConstants';

export type SymptomEntryPeriodTabProps = {
  dateKey: string;
  isBleeding: boolean;
  details: PeriodBleedingDetails;
  isSaving: boolean;
  onChangeBleeding: (isBleeding: boolean) => void;
  onChangeDetails: (details: PeriodBleedingDetails) => void;
};

export const SymptomEntryPeriodTab = ({
  dateKey,
  isBleeding,
  details,
  isSaving,
  onChangeBleeding,
  onChangeDetails,
}: SymptomEntryPeriodTabProps) => (
  <PeriodBleedingForm
    dateKey={dateKey}
    isBleeding={isBleeding}
    details={details}
    disabled={isSaving}
    onChangeBleeding={onChangeBleeding}
    onChangeDetails={onChangeDetails}
  />
);
