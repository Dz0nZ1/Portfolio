import en from './en.json';
import sr from './sr.json';

export const languages = { en: 'English', sr: 'Srpski' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

const dictionaries: Record<Lang, Record<string, string>> = { en, sr };

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'sr') return 'sr';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return dictionaries[lang][key] ?? key;
  };
}
