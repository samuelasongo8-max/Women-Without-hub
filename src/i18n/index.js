import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {
  LANGUAGES,
  DEFAULT_LANG,
  FALLBACK_LANG,
  EXTRA_FONTS,
  isSupported,
  isRtl,
} from './languages.js'

/**
 * Lazy-load a locale JSON. Each file lives in src/locales/<code>.json and is
 * code-split by Vite (dynamic import), so only the languages the user opens
 * are ever downloaded.
 */
const loaders = {
  // English is eagerly bundled (see import.meta.glob below), so it has no
  // lazy loader — keeping it out here avoids Vite's dual-import warning.
  fr: () => import('../locales/fr.json'),
  sw: () => import('../locales/sw.json'),
  ar: () => import('../locales/ar.json'),
  pt: () => import('../locales/pt.json'),
  de: () => import('../locales/de.json'),
  it: () => import('../locales/it.json'),
  es: () => import('../locales/es.json'),
  so: () => import('../locales/so.json'),
  zh: () => import('../locales/zh.json'),
  ru: () => import('../locales/ru.json'),
  pl: () => import('../locales/pl.json'),
}

/** Cache of already-loaded resources so we never import the same file twice. */
const loaded = {}

async function loadLanguage(code) {
  if (loaded[code] || !loaders[code]) return
  const mod = await loaders[code]()
  i18n.addResourceBundle(code, 'translation', mod.default)
  loaded[code] = true
}

/** Keep <html lang> and dir in sync, and load the script-specific font. */
function applyDocumentAttributes(code) {
  const html = document.documentElement
  html.lang = code
  html.dir = isRtl(code) ? 'rtl' : 'ltr'
  html.setAttribute('data-lang', code)

  const href = EXTRA_FONTS[code]
  if (href && !document.getElementById(`font-${code}`)) {
    const link = document.createElement('link')
    link.id = `font-${code}`
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

/** Map any detected value to a supported language, else the default. */
function resolveLanguage(detected) {
  if (detected && isSupported(detected)) return detected
  return DEFAULT_LANG
}

// Preload English synchronously so the very first paint is translated.
const enBundle = import.meta.glob('../locales/en.json', { eager: true })
loaded.en = true

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enBundle['../locales/en.json'].default },
    },
    fallbackLng: FALLBACK_LANG,
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    defaultNS: 'translation',
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      // localStorage first (user's explicit choice), then browser language.
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'wwbh.lang',
      caches: ['localStorage'],
    },
    // Never surface raw keys to users.
    parseMissingKeyHandler: () => '',
    returnNull: false,
    react: { useSuspense: false },
  })
  .then(() => {
    // Apply the resolved language and load it if it isn't English.
    const current = resolveLanguage(i18n.resolvedLanguage || i18n.language)
    loadLanguage(current).then(() => i18n.changeLanguage(current))
    applyDocumentAttributes(current)
  })

// Whenever the language changes, keep <html> attributes/font in sync.
i18n.on('languageChanged', (code) => {
  applyDocumentAttributes(code)
})

/** Change language: load its bundle first (if needed), then switch. */
export async function setLanguage(code) {
  const resolved = isSupported(code) ? code : DEFAULT_LANG
  if (loaded[resolved]) {
    applyDocumentAttributes(resolved)
    return i18n.changeLanguage(resolved)
  }
  await loadLanguage(resolved)
  applyDocumentAttributes(resolved)
  return i18n.changeLanguage(resolved)
}

export { loadLanguage, applyDocumentAttributes }
export default i18n
