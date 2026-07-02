import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { type Language } from '@/lib/i18n/language';

type UseTranslateResult = {
  t: (key: string, options?: Record<string, unknown>) => string;
  language: string;
  changeLanguage: (language: Language) => Promise<void>;
};

export const useTranslate = (): UseTranslateResult => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(
    async (language: Language) => {
      await i18n.changeLanguage(language);
    },
    [i18n],
  );

  return {
    t: (key, options) => t(key, options),
    language: i18n.language,
    changeLanguage,
  };
};
