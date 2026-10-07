import { ReportDoctorQuestionOption } from '@/components/report/ReportDoctorQuestionOption';
import { Box } from '@/components/ui/Box';

export type ClinicalTopicOption = {
  id: string;
  labelKey: string;
};

export type ClinicalTopicButtonListProps = {
  options: readonly ClinicalTopicOption[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
};

export const ClinicalTopicButtonList = ({
  options,
  selectedIds,
  onToggle,
}: ClinicalTopicButtonListProps) => (
  <Box gap="sm">
    {options.map((option) => (
      <ReportDoctorQuestionOption
        key={option.id}
        id={option.id}
        labelKey={option.labelKey}
        isSelected={selectedIds.includes(option.id)}
        onToggle={onToggle}
      />
    ))}
  </Box>
);
