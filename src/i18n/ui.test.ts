import { describe, it, expect } from 'vitest';
import { useTranslations, getLangFromUrl } from './ui';

describe('useTranslations', () => {
  it('returns the English string for a key', () => {
    const t = useTranslations('en');
    expect(t('nav.about')).toBe('About');
  });

  it('returns the Serbian string for a key', () => {
    const t = useTranslations('sr');
    expect(t('nav.about')).toBe('O meni');
  });

  it('falls back to the key when missing', () => {
    const t = useTranslations('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('getLangFromUrl', () => {
  it('detects sr from a /sr/ path', () => {
    expect(getLangFromUrl(new URL('https://x.com/sr/'))).toBe('sr');
  });

  it('defaults to en at the root', () => {
    expect(getLangFromUrl(new URL('https://x.com/'))).toBe('en');
  });
});
