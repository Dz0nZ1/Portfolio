import type { Lang } from '../i18n/ui';

export interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  order: number;
  featured: boolean;
  lang: Lang;
  key: string;
}

export function filterByLang<T extends { lang: Lang }>(items: T[], lang: Lang): T[] {
  return items.filter((item) => item.lang === lang);
}

export function sortProjects<T extends { order: number; featured: boolean }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });
}
