import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // default language
    debug: true, // disable in production
    backend: {
      loadPath: '/locales/{{lng}}.json', // points to public/locales/
    },
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

export default i18n;
