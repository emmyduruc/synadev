import type { UserHealthRecord } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, updateCurrentUserHealthRecord } from '@/lib/api';
import { resolveHealthRecord } from '@/lib/healthRecord/healthRecordHelpers';

export const useHealthRecord = () => {
  const [record, setRecord] = useState<UserHealthRecord>(createInitialRecord);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const user = await getCurrentUser();
      setRecord(resolveHealthRecord(user.healthRecord));
    } catch {
      setRecord(resolveHealthRecord(null));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveRecord = useCallback(async (next: UserHealthRecord) => {
    setIsSaving(true);

    try {
      const payload: UserHealthRecord = {
        ...next,
        syncedAt: new Date().toISOString(),
      };
      const user = await updateCurrentUserHealthRecord(payload);
      const saved = resolveHealthRecord(user.healthRecord);
      setRecord(saved);
      return saved;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    record,
    isLoading,
    isSaving,
    refresh,
    saveRecord,
  };
};

const createInitialRecord = (): UserHealthRecord => resolveHealthRecord(null);
