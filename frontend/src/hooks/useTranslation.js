import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { language } = useUserStore();

  const t = (section, key) => {
    const langData = translations[language] || translations.ENG;
    const sectionData = langData[section];
    if (sectionData && sectionData[key]) return sectionData[key];

    // Fallback to English
    const fallback = translations.ENG[section];
    if (fallback && fallback[key]) return fallback[key];

    return `${section}.${key}`;
  };

  return { t, language };
}
