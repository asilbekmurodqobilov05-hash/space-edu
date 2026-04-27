import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { language } = useUserStore();

  const t = (section: keyof typeof translations.ENG, key: string) => {
    const langTranslations = translations[language] || translations.ENG;
    const sectionTranslations = langTranslations[section] as any;
    
    if (sectionTranslations && sectionTranslations[key]) {
      return sectionTranslations[key];
    }
    
    // Fallback to English
    const fallbackSection = translations.ENG[section] as any;
    if (fallbackSection && fallbackSection[key]) {
      return fallbackSection[key];
    }
    
    return `${section}.${key}`;
  };

  return { t, language };
}
