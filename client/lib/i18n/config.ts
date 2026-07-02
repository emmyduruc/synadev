import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE, LANGUAGE, type Language } from './language';

import de from '@/locales/de.json';
import en from '@/locales/en.json';


export { DEFAULT_LANGUAGE, LANGUAGE, type Language } from './language';

export const resources = {
  [LANGUAGE.en]: { translation: en },
  [LANGUAGE.de]: { translation: de },
} as const;

const supportedLanguages = Object.values(LANGUAGE) as string[];

const resolveDeviceLanguage = (): Language => {
  const deviceCode = getLocales()[0]?.languageCode ?? DEFAULT_LANGUAGE;

  return supportedLanguages.includes(deviceCode)
    ? (deviceCode as Language)
    : DEFAULT_LANGUAGE;
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: resolveDeviceLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export { i18n };
