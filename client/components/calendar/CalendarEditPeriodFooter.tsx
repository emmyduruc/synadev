import { ModalCancelSaveFooter } from '@/components/ui/ModalCancelSaveFooter';

export type CalendarEditPeriodFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

/** @deprecated Prefer ModalCancelSaveFooter — kept as a thin alias for calendar edit mode. */
export const CalendarEditPeriodFooter = (props: CalendarEditPeriodFooterProps) => (
  <ModalCancelSaveFooter {...props} />
);
