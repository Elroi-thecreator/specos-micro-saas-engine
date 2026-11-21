import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, SUPPORTED_LOCALES } from '../src/lib/i18n/translations';
import { SupportedLocale } from '../src/lib/types';

describe('Internationalization (DEV-001) Standards', () => {
  const enKeys = Object.keys(TRANSLATIONS['en']).sort();

  it('defines 7 supported locales including Arabic RTL', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(7);
    const arabic = SUPPORTED_LOCALES.find((l) => l.code === 'ar');
    expect(arabic).toBeDefined();
    expect(arabic?.dir).toBe('rtl');
  });

  const localesToTest: SupportedLocale[] = ['ja', 'es', 'fr', 'de', 'hi', 'ar'];

  localesToTest.forEach((locale) => {
    it(`guarantees dictionary completeness for locale: ${locale}`, () => {
      const targetDict = TRANSLATIONS[locale];
      expect(targetDict).toBeDefined();

      const missingKeys = enKeys.filter((key) => !targetDict[key]);
      expect(
        missingKeys,
        `Locale '${locale}' is missing translation keys: ${missingKeys.join(', ')}`
      ).toEqual([]);
    });
  });
});
