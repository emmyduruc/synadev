import type { Phq2AssessmentSubmission } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { getLatestPhq2Assessment } from '@/lib/api';

export const useLatestPhq2Assessment = () => {
  const [submission, setSubmission] = useState<Phq2AssessmentSubmission | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const latest = await getLatestPhq2Assessment();
      setSubmission(latest.submission);
    } catch {
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { submission, isLoading, refresh };
};
