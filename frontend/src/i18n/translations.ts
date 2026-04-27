import en from '@/locales/en.json';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';

export const translations = {
  ENG: en,
  UZB: uz,
  RUS: ru,
};

export type TranslationKey = keyof typeof en;
