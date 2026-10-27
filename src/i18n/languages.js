/**
 * The 10 supported languages.
 *  - code:     BCP-47 code used by i18next and <html lang>.
 *  - native:   language name written in its own language (shown in the menu).
 *  - short:    2-letter code shown on the compact trigger.
 *  - dir:      text direction ('ltr' for all but Arabic).
 * Order here is the order shown in the switcher dropdown.
 */
export const LANGUAGES = [
  { code: 'en', native: 'English', short: 'EN', dir: 'ltr' },
  { code: 'fr', native: 'Français', short: 'FR', dir: 'ltr' },
  { code: 'sw', native: 'Kiswahili', short: 'SW', dir: 'ltr' },
  { code: 'ar', native: 'العربية', short: 'AR', dir: 'rtl' },
  { code: 'pt', native: 'Português', short: 'PT', dir: 'ltr' },
  { code: 'de', native: 'Deutsch', short: 'DE', dir: 'ltr' },
  { code: 'it', native: 'Italiano', short: 'IT', dir: 'ltr' },
  { code: 'es', native: 'Español', short: 'ES', dir: 'ltr' },
  { code: 'so', native: 'Soomaali', short: 'SO', dir: 'ltr' },
  { code: 'zh', native: '中文', short: 'ZH', dir: 'ltr' },
  { code: 'ru', native: 'Русский', short: 'RU', dir: 'ltr' },
  { code: 'pl', native: 'Polski', short: 'PL', dir: 'ltr' },
]

export const DEFAULT_LANG = 'en'
export const FALLBACK_LANG = 'en'

/** Languages that need a dedicated webfont (to avoid missing glyph boxes). */
export const EXTRA_FONTS = {
  ar: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  ru: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap',
  pl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap',
}

export function isSupported(code) {
  return LANGUAGES.some((l) => l.code === code)
}

export function langMeta(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
}

export function isRtl(code) {
  return langMeta(code).dir === 'rtl'
}
