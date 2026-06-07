import { describe, it, expect } from 'vitest';
import { filterByLang, sortProjects, type ProjectData } from './projects';

const make = (over: Partial<ProjectData>): ProjectData => ({
  title: 't', description: 'd', tags: [], order: 0,
  featured: false, lang: 'en', key: 's', ...over,
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
    const a = make({ key: 'a', order: 2, featured: false });
    const b = make({ key: 'b', order: 5, featured: true });
    const c = make({ key: 'c', order: 1, featured: false });
    const sorted = sortProjects([a, b, c]).map((p) => p.key);
    expect(sorted).toEqual(['b', 'c', 'a']);
  });
});
