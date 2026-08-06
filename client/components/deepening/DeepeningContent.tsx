import { useCallback, useEffect, useState, type ReactElement } from 'react';

import { DeepeningEditSheet } from '@/components/deepening/DeepeningEditSheet';
import { DeepeningEntryRow } from '@/components/deepening/DeepeningEntryRow';
import { DeepeningFieldForm } from '@/components/deepening/DeepeningFieldForm';
import { DeepeningProgressCard } from '@/components/deepening/DeepeningProgressCard';
import { DeepeningSectionCard } from '@/components/deepening/DeepeningSectionCard';
import { Box } from '@/components/ui/Box';
import { useDeepeningEntries } from '@/hooks/useDeepeningEntries';
import { useTranslate } from '@/hooks/useTranslate';
import {
  DEEPENING_ENTRY_TOTAL,
  DEEPENING_FIELDS,
  DEEPENING_FIELD_INPUT,
  DEEPENING_SECTIONS,
  type DeepeningFieldId,
} from '@/lib/deepening/deepeningCatalog';
import {
  isDeepeningFieldCompleted,
  type DeepeningFieldValue,
} from '@/lib/deepening/deepeningTypes';
import { formatDeepeningFieldSummary } from '@/lib/deepening/formatDeepeningFieldSummary';
import { toast } from '@/lib/sonner';

export const DeepeningContent = (): ReactElement => {
  const { t } = useTranslate();
  const { entries, completedCount, saveField } = useDeepeningEntries();
  const [activeFieldId, setActiveFieldId] = useState<DeepeningFieldId | null>(null);
  const [draft, setDraft] = useState<DeepeningFieldValue | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeFieldId) {
      setDraft(null);
      return;
    }

    setDraft(entries[activeFieldId]);
  }, [activeFieldId, entries]);

  const closeSheet = useCallback(() => {
    setActiveFieldId(null);
    setDraft(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!activeFieldId || !draft) {
      return;
    }

    setIsSaving(true);

    try {
      await saveField(activeFieldId, draft);
      toast.success(t('deepening_save_success'));
      closeSheet();
    } catch {
      toast.error(t('deepening_save_error'));
    } finally {
      setIsSaving(false);
    }
  }, [activeFieldId, closeSheet, draft, saveField, t]);

  const handleAutoSaveChange = useCallback(
    async (next: DeepeningFieldValue) => {
      setDraft(next);

      if (!activeFieldId) {
        return;
      }

      try {
        await saveField(activeFieldId, next);
      } catch {
        toast.error(t('deepening_save_error'));
      }
    },
    [activeFieldId, saveField, t],
  );

  const activeField = activeFieldId ? DEEPENING_FIELDS[activeFieldId] : null;
  const isMigraineSheet = activeField?.inputKind === DEEPENING_FIELD_INPUT.migraine;

  const handleDraftChange = useCallback(
    (next: DeepeningFieldValue) => {
      if (isMigraineSheet) {
        void handleAutoSaveChange(next);
        return;
      }

      setDraft(next);
    },
    [handleAutoSaveChange, isMigraineSheet],
  );

  let sheetTitle = '';

  if (isMigraineSheet) {
    sheetTitle = t('deepening_section_migraine');
  } else if (activeField) {
    sheetTitle = t(activeField.labelKey);
  }

  return (
    <>
      <Box gap="md">
        <DeepeningProgressCard
          completedCount={completedCount}
          totalCount={DEEPENING_ENTRY_TOTAL}
        />

        {DEEPENING_SECTIONS.map((section) => (
          <DeepeningSectionCard
            key={section.id}
            title={t(section.titleKey)}
            icon={section.icon}>
            {section.fieldIds.map((fieldId) => {
              const field = DEEPENING_FIELDS[fieldId];
              const value = entries[fieldId];
              const completed = isDeepeningFieldCompleted(value);

              return (
                <DeepeningEntryRow
                  key={fieldId}
                  label={t(field.labelKey)}
                  isCompleted={completed}
                  summary={formatDeepeningFieldSummary(fieldId, value, t)}
                  onPress={() => {
                    setActiveFieldId(fieldId);
                  }}
                />
              );
            })}
          </DeepeningSectionCard>
        ))}
      </Box>

      <DeepeningEditSheet
        visible={activeFieldId !== null && draft !== null}
        title={sheetTitle}
        description={
          isMigraineSheet ? t('deepening_migraine_description') : undefined
        }
        autoSave={isMigraineSheet}
        onCancel={closeSheet}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}>
        {activeFieldId && draft ? (
          <DeepeningFieldForm
            fieldId={activeFieldId}
            value={draft}
            onChange={handleDraftChange}
          />
        ) : null}
      </DeepeningEditSheet>
    </>
  );
};
