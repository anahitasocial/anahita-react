import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import en from './en-GB';

const DEBUG = process.env.NODE_ENV !== 'production';

i18n
  .use(reactI18nextModule)
  .init({
    resources: {
      en,
    },
    interpolation: {
      escapeValue: false,
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: DEBUG,
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      nsMode: 'default',
    },
  }, (err) => {
    return err && console.log('Error loading i18n translation module.', err);
  });

export default i18n;
