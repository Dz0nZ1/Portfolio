import { describe, it, expect } from 'vitest';
import { filterByLang, sortProjects, type ProjectData } from './projects';

const make = (over: Partial<ProjectData>): ProjectData => ({
  title: 't', description: 'd', tags: [], order: 0,
  featured: false, lang: 'en', slug: 's', ...over,
});

describe('filterByLang', () => {
  it('keeps only entries for the given language', () => {
    const items = [make({ lang: 'en' }), make({ lang: 'sr' })];
    expect(filterByLang(items, 'sr')).toHaveLength(1);
    expect(filterByLang(items, 'sr')[0].lang).toBe('sr');
  });
});

describe('sortProjects', () => {
  it('orders featured first, then by ascending order', () => {
    const a = make({ slug: 'a', order: 2, featured: false });
    const b = make({ slug: 'b', order: 5, featured: true });
    const c = make({ slug: 'c', order: 1, featured: false });
    const sorted = sortProjects([a, b, c]).map((p) => p.slug);
    expect(sorted).toEqual(['b', 'c', 'a']);
  });
});
