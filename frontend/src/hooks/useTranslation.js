import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { language } = useUserStore();

  const t = (section, key) => {
    const langData = translations[language] || translations.ENG;
    const sectionData = langData[section];
    
    if (!sectionData) return `${section}.${key}`;

    const getNested = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const value = getNested(sectionData, key);
    if (value) return value;

    // Fallback to English
    const fallbackSection = translations.ENG[section];
    if (fallbackSection) {
      const fallbackValue = getNested(fallbackSection, key);
      if (fallbackValue) return fallbackValue;
    }

    return `${section}.${key}`;
  };

  // i18n.language returns ISO codes ('en', 'ru', 'uz') for compatibility
  const LANG_ISO = { ENG: 'en', RUS: 'ru', UZB: 'uz' };
  const i18n = { language: LANG_ISO[language] || 'uz' };

  return { t, language, i18n };
}
