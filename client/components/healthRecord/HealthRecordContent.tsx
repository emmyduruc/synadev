import type {
  HealthRecordLabs,
  HealthRecordMedication,
  UserHealthRecord,
} from '@syna/shared-types';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { useCallback, useEffect, useState, type ReactElement } from 'react';

import { DeepeningEditSheet } from '@/components/deepening/DeepeningEditSheet';
import { DeepeningEntryRow } from '@/components/deepening/DeepeningEntryRow';
import { DeepeningSectionCard } from '@/components/deepening/DeepeningSectionCard';
import { HealthRecordConcernsForm } from '@/components/healthRecord/HealthRecordConcernsForm';
import { HealthRecordLabsForm } from '@/components/healthRecord/HealthRecordLabsForm';
import { HealthRecordMedicationForm } from '@/components/healthRecord/HealthRecordMedicationForm';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useHealthRecord } from '@/hooks/useHealthRecord';
import { useLatestPhq2Assessment } from '@/hooks/useLatestPhq2Assessment';
import { useTranslate } from '@/hooks/useTranslate';
import {
  createEmptyMedicationDraft,
  formatConcernsSummary,
  formatLabsSummary,
  formatMedicationSummary,
} from '@/lib/healthRecord/healthRecordHelpers';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';

const HEALTH_RECORD_SHEET = {
  labs: 'labs',
  medication: 'medication',
  concerns: 'concerns',
} as const;

type HealthRecordSheetId =
  (typeof HEALTH_RECORD_SHEET)[keyof typeof HEALTH_RECORD_SHEET];

const EMPTY_LABS: HealthRecordLabs = {
  fsh: null,
  estradiol: null,
  drawnAt: null,
  notes: null,
};

const isIsoDateOrEmpty = (value: string | null): boolean => {
  if (!value) {
    return true;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

export const HealthRecordContent = (): ReactElement => {
  const { t } = useTranslate();
  const router = useRouter();
  const { record, isLoading, isSaving, saveRecord } = useHealthRecord();
  const { submission: phq2Submission, refresh: refreshPhq2 } =
    useLatestPhq2Assessment();

  const [sheetId, setSheetId] = useState<HealthRecordSheetId | null>(null);
  const [labsDraft, setLabsDraft] = useState<HealthRecordLabs>(EMPTY_LABS);
  const [medicationDraft, setMedicationDraft] =
    useState<HealthRecordMedication>(createEmptyMedicationDraft);
  const [isEditingExistingMedication, setIsEditingExistingMedication] =
    useState(false);
  const [concernsDraft, setConcernsDraft] = useState('');

  useEffect(() => {
    if (sheetId === HEALTH_RECORD_SHEET.labs) {
      setLabsDraft(record.labs ?? EMPTY_LABS);
      return;
    }

    if (sheetId === HEALTH_RECORD_SHEET.concerns) {
      setConcernsDraft(record.concerns ?? '');
    }
  }, [record.concerns, record.labs, sheetId]);

  const closeSheet = useCallback(() => {
    setSheetId(null);
    setIsEditingExistingMedication(false);
  }, []);

  const openMedicationSheet = useCallback((existing?: HealthRecordMedication) => {
    if (existing) {
      setMedicationDraft(existing);
      setIsEditingExistingMedication(true);
    } else {
      setMedicationDraft(createEmptyMedicationDraft());
      setIsEditingExistingMedication(false);
    }

    setSheetId(HEALTH_RECORD_SHEET.medication);
  }, []);

  const persist = useCallback(
    async (next: UserHealthRecord) => {
      try {
        await saveRecord(next);
        toast.success(t('health_record_save_success'));
        closeSheet();
      } catch {
        toast.error(t('health_record_save_error'));
      }
    },
    [closeSheet, saveRecord, t],
  );

  const handleSaveLabs = useCallback(async () => {
    if (!isIsoDateOrEmpty(labsDraft.drawnAt)) {
      toast.error(t('health_record_date_invalid'));
      return;
    }

    await persist({
      ...record,
      labs: labsDraft,
    });
  }, [labsDraft, persist, record, t]);

  const handleSaveMedication = useCallback(async () => {
    const name = medicationDraft.name.trim();

    if (!name) {
      toast.error(t('health_record_meds_name_required'));
      return;
    }

    if (!isIsoDateOrEmpty(medicationDraft.startedAt)) {
      toast.error(t('health_record_date_invalid'));
      return;
    }

    const nextMedication: HealthRecordMedication = {
      ...medicationDraft,
      name,
      dose: medicationDraft.dose?.trim() ? medicationDraft.dose.trim() : null,
      notes: medicationDraft.notes?.trim() ? medicationDraft.notes.trim() : null,
    };

    let medications = [...record.medications];

    if (isEditingExistingMedication) {
      medications = medications.map((item) =>
        item.id === nextMedication.id ? nextMedication : item,
      );
    } else {
      medications = [...medications, nextMedication];
    }

    await persist({
      ...record,
      medications,
    });
  }, [
    isEditingExistingMedication,
    medicationDraft,
    persist,
    record,
    t,
  ]);

  const handleDeleteMedication = useCallback(async () => {
    if (!isEditingExistingMedication) {
      return;
    }

    await persist({
      ...record,
      medications: record.medications.filter(
        (item) => item.id !== medicationDraft.id,
      ),
    });
  }, [isEditingExistingMedication, medicationDraft.id, persist, record]);

  const handleSaveConcerns = useCallback(async () => {
    const trimmed = concernsDraft.trim();
    await persist({
      ...record,
      concerns: trimmed.length > 0 ? trimmed : null,
    });
  }, [concernsDraft, persist, record]);

  const handleOpenPhq2 = useCallback(() => {
    router.push(ROUTES.assessment.phq2 as Href);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      void refreshPhq2();
    }, [refreshPhq2]),
  );

  let sheetTitle = '';
  let sheetDescription: string | undefined;

  if (sheetId === HEALTH_RECORD_SHEET.labs) {
    sheetTitle = t('health_record_section_labs');
    sheetDescription = t('health_record_labs_sheet_description');
  } else if (sheetId === HEALTH_RECORD_SHEET.medication) {
    sheetTitle = isEditingExistingMedication
      ? t('health_record_meds_edit_title')
      : t('health_record_meds_add_title');
  } else if (sheetId === HEALTH_RECORD_SHEET.concerns) {
    sheetTitle = t('health_record_section_concerns');
    sheetDescription = t('health_record_concerns_sheet_description');
  }

  const emptyLabel = t('health_record_empty_summary');
  const labsCompleted = Boolean(record.labs);
  const concernsCompleted = Boolean(record.concerns?.trim());
  const phq2Completed = Boolean(phq2Submission);
  const phq2Summary = phq2Submission
    ? t('health_record_phq2_score_summary', { score: phq2Submission.total })
    : emptyLabel;

  if (isLoading) {
    return (
      <Box paddingY="lg">
        <Text size="sm" color="foreground-muted" align="center">
          {t('health_record_loading')}
        </Text>
      </Box>
    );
  }

  return (
    <Box gap="md">
      <Text size="sm" color="foreground-muted">
        {t('health_record_intro')}
      </Text>

      <DeepeningSectionCard
        title={t('health_record_section_labs')}
        icon={{ ios: 'cross.case.fill', android: 'medical_services', web: 'medical_services' }}>
        <DeepeningEntryRow
          label={t('health_record_labs_row_label')}
          isCompleted={labsCompleted}
          summary={formatLabsSummary(record, emptyLabel)}
          onPress={() => setSheetId(HEALTH_RECORD_SHEET.labs)}
        />
      </DeepeningSectionCard>

      <DeepeningSectionCard
        title={t('health_record_section_medications')}
        icon={{ ios: 'pills.fill', android: 'medication', web: 'medication' }}>
        {record.medications.map((medication) => (
          <DeepeningEntryRow
            key={medication.id}
            label={formatMedicationSummary(medication)}
            isCompleted
            summary={
              medication.startedAt
                ? t('health_record_meds_started_summary', {
                    date: medication.startedAt,
                  })
                : undefined
            }
            onPress={() => openMedicationSheet(medication)}
          />
        ))}
        <DeepeningEntryRow
          label={t('health_record_meds_add_row_label')}
          isCompleted={false}
          onPress={() => openMedicationSheet()}
        />
      </DeepeningSectionCard>

      <DeepeningSectionCard
        title={t('health_record_section_phq2')}
        icon={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}>
        <DeepeningEntryRow
          label={t('health_record_phq2_row_label')}
          isCompleted={phq2Completed}
          summary={phq2Summary}
          onPress={handleOpenPhq2}
        />
      </DeepeningSectionCard>

      <DeepeningSectionCard
        title={t('health_record_section_concerns')}
        icon={{ ios: 'text.bubble.fill', android: 'chat', web: 'chat' }}>
        <DeepeningEntryRow
          label={t('health_record_concerns_row_label')}
          isCompleted={concernsCompleted}
          summary={formatConcernsSummary(record.concerns, emptyLabel)}
          onPress={() => setSheetId(HEALTH_RECORD_SHEET.concerns)}
        />
      </DeepeningSectionCard>

      <DeepeningEditSheet
        visible={sheetId !== null}
        title={sheetTitle}
        description={sheetDescription}
        onCancel={closeSheet}
        onSave={() => {
          if (sheetId === HEALTH_RECORD_SHEET.labs) {
            void handleSaveLabs();
            return;
          }

          if (sheetId === HEALTH_RECORD_SHEET.medication) {
            void handleSaveMedication();
            return;
          }

          if (sheetId === HEALTH_RECORD_SHEET.concerns) {
            void handleSaveConcerns();
          }
        }}
        isSaving={isSaving}>
        {sheetId === HEALTH_RECORD_SHEET.labs ? (
          <HealthRecordLabsForm value={labsDraft} onChange={setLabsDraft} />
        ) : null}

        {sheetId === HEALTH_RECORD_SHEET.medication ? (
          <Box gap="md">
            <HealthRecordMedicationForm
              value={medicationDraft}
              onChange={setMedicationDraft}
            />
            {isEditingExistingMedication ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  void handleDeleteMedication();
                }}
                className="items-center py-3">
                <Text size="sm" weight="semibold" color="error">
                  {t('health_record_meds_delete_label')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </Box>
        ) : null}

        {sheetId === HEALTH_RECORD_SHEET.concerns ? (
          <HealthRecordConcernsForm
            value={concernsDraft}
            onChange={setConcernsDraft}
          />
        ) : null}
      </DeepeningEditSheet>
    </Box>
  );
};
