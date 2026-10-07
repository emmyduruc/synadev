import type {
  ClinicalFamilyHistoryId,
  ClinicalGeneralConditionId,
  ClinicalGynecologicalHistoryId,
  ClinicalLifestyleTopicId,
  ClinicalMedicationTopicId,
  ClinicalPersistentComplaintId,
  ClinicalProfile,
} from '@syna/shared-types';

import { ClinicalChipGrid } from '@/components/clinicalProfile/ClinicalChipGrid';
import { ClinicalSectionCard } from '@/components/clinicalProfile/ClinicalSectionCard';
import { ClinicalTopicButtonList } from '@/components/clinicalProfile/ClinicalTopicButtonList';
import { ClinicalYesNoField } from '@/components/clinicalProfile/ClinicalYesNoField';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TextInput } from '@/components/ui/TextInput';
import { useTranslate } from '@/hooks/useTranslate';
import {
  CLINICAL_FAMILY_HISTORY_OPTIONS,
  CLINICAL_GENERAL_CONDITION_OPTIONS,
  CLINICAL_GYNECOLOGICAL_HISTORY_OPTIONS,
  CLINICAL_LIFESTYLE_TOPIC_OPTIONS,
  CLINICAL_MEDICATION_TOPIC_OPTIONS,
  CLINICAL_PERSISTENT_COMPLAINT_OPTIONS,
  CLINICAL_YES_NO_FIELDS,
  type ClinicalYesNoFieldId,
  toggleIdInList,
} from '@/lib/clinicalProfile/clinicalProfileCatalog';

export type ClinicalProfileContentProps = {
  profile: ClinicalProfile;
  onChange: (next: ClinicalProfile) => void;
};

export const ClinicalProfileContent = ({
  profile,
  onChange,
}: ClinicalProfileContentProps) => {
  const { t } = useTranslate();

  const setYesNo = (fieldId: ClinicalYesNoFieldId, value: boolean) => {
    onChange({ ...profile, [fieldId]: value });
  };

  return (
    <Box gap="lg" paddingX="lg" className="pb-8 pt-2">
      <Box gap="sm">
        <Text size="xl" weight="bold" family="serif" className="leading-tight">
          {t('clinical_profile_title')}
        </Text>
        <Text
          size="sm"
          color="foreground-muted"
          family="sans"
          className="leading-relaxed">
          {t('clinical_profile_intro')}
        </Text>
      </Box>

      <ClinicalSectionCard title={t('clinical_profile_history_heading')}>
        <Box gap="md">
          {CLINICAL_YES_NO_FIELDS.map((field) => (
            <ClinicalYesNoField
              key={field.id}
              label={t(field.labelKey)}
              value={profile[field.id]}
              onChange={(value) => setYesNo(field.id, value)}
            />
          ))}

          <TextInput
            label={t('clinical_profile_age_at_first_period')}
            value={
              profile.ageAtFirstPeriod === null
                ? ''
                : String(profile.ageAtFirstPeriod)
            }
            onChangeText={(text) => {
              const digits = text.replace(/[^\d]/g, '');

              if (digits.length === 0) {
                onChange({ ...profile, ageAtFirstPeriod: null });
                return;
              }

              const nextAge = Number(digits);
              onChange({
                ...profile,
                ageAtFirstPeriod: Number.isFinite(nextAge) ? nextAge : null,
              });
            }}
            placeholder={t('clinical_profile_age_at_first_period_placeholder')}
            keyboardType="number-pad"
            inputClassName="tabular-nums"
            maxLength={2}
          />
        </Box>
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_persistent_heading')}
        description={t('clinical_profile_persistent_body')}>
        <ClinicalChipGrid
          options={CLINICAL_PERSISTENT_COMPLAINT_OPTIONS}
          selectedIds={profile.persistentComplaintIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              persistentComplaintIds: toggleIdInList(
                profile.persistentComplaintIds,
                id as ClinicalPersistentComplaintId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_gyn_heading')}
        description={t('clinical_profile_shared_body')}>
        <ClinicalTopicButtonList
          options={CLINICAL_GYNECOLOGICAL_HISTORY_OPTIONS}
          selectedIds={profile.gynecologicalHistoryIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              gynecologicalHistoryIds: toggleIdInList(
                profile.gynecologicalHistoryIds,
                id as ClinicalGynecologicalHistoryId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_conditions_heading')}
        description={t('clinical_profile_shared_body')}>
        <ClinicalTopicButtonList
          options={CLINICAL_GENERAL_CONDITION_OPTIONS}
          selectedIds={profile.generalConditionIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              generalConditionIds: toggleIdInList(
                profile.generalConditionIds,
                id as ClinicalGeneralConditionId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_medications_heading')}
        description={t('clinical_profile_shared_body')}>
        <ClinicalTopicButtonList
          options={CLINICAL_MEDICATION_TOPIC_OPTIONS}
          selectedIds={profile.medicationTopicIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              medicationTopicIds: toggleIdInList(
                profile.medicationTopicIds,
                id as ClinicalMedicationTopicId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_lifestyle_heading')}
        description={t('clinical_profile_shared_body')}>
        <ClinicalTopicButtonList
          options={CLINICAL_LIFESTYLE_TOPIC_OPTIONS}
          selectedIds={profile.lifestyleTopicIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              lifestyleTopicIds: toggleIdInList(
                profile.lifestyleTopicIds,
                id as ClinicalLifestyleTopicId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <ClinicalSectionCard
        title={t('clinical_profile_family_heading')}
        description={t('clinical_profile_shared_body')}>
        <ClinicalTopicButtonList
          options={CLINICAL_FAMILY_HISTORY_OPTIONS}
          selectedIds={profile.familyHistoryIds}
          onToggle={(id) =>
            onChange({
              ...profile,
              familyHistoryIds: toggleIdInList(
                profile.familyHistoryIds,
                id as ClinicalFamilyHistoryId,
              ),
            })
          }
        />
      </ClinicalSectionCard>

      <Box className="overflow-hidden rounded-2xl border border-border bg-card px-5 py-5" gap="sm">
        <Text size="xs" color="foreground-muted" family="sans">
          {t('clinical_profile_notice_label')}
        </Text>
        <Text size="sm" family="sans" className="leading-relaxed">
          {t('clinical_profile_notice_body')}
        </Text>
      </Box>
    </Box>
  );
};
