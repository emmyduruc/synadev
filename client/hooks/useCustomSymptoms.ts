import type { CreateCustomSymptom, CustomSymptom } from '@syna/shared-types';
import { useCallback, useEffect, useState } from 'react';

import { createCustomSymptom, getCustomSymptoms } from '@/lib/api';

export const useCustomSymptoms = () => {
  const [customSymptoms, setCustomSymptoms] = useState<CustomSymptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { symptoms } = await getCustomSymptoms();

        if (isMounted) {
          setCustomSymptoms(symptoms);
        }
      } catch {
        if (isMounted) {
          setCustomSymptoms([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const addCustomSymptom = useCallback(async (input: CreateCustomSymptom) => {
    const created = await createCustomSymptom(input);
    setCustomSymptoms((previous) => [...previous, created]);

    return created;
  }, []);

  return { customSymptoms, isLoading, addCustomSymptom };
};
