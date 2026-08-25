import type { SubmitPhq2Assessment } from '@syna/shared-types';
import { useCallback } from 'react';

import { submitPhq2Assessment } from '@/lib/api';

export const useSubmitPhq2Assessment = () => {
  const submit = useCallback(async (payload: SubmitPhq2Assessment) => {
    return submitPhq2Assessment(payload);
  }, []);

  return { submit };
};
