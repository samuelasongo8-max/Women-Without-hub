/**
 * Sync the `contact.*` keys introduced by the Contact page i18n refactor
 * into every locale file.
 *
 * The Contact page previously hardcoded ~17 English strings inline. Those are
 * now i18n keys (see src/locales/en.json -> contact.*). This script copies
 * them into the other locale files, using the real translation from
 * scripts/contact-translations/<locale>.json when one exists, and the English
 * source string otherwise (so a locale never renders an empty string).
 *
 * Safe to re-run: existing non-empty values are never overwritten unless a
 * real translation exists for that key (used to fix English copies).
 *
 * Run with:  node scripts/sync-contact-keys.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.resolve(here, '..', 'src', 'locales')
const translationsDir = path.join(here, 'contact-translations')

const en = JSON.parse(readFileSync(path.join(localesDir, 'en.json'), 'utf8'))
const enContact = en.contact

/** Load a per-locale translation table, if present. */
function loadTable(code) {
  const file = path.join(translationsDir, `${code}.json`)
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
}

const files = readdirSync(localesDir).filter((f) => f.endsWith('.json'))

let added = 0
let translated = 0
let overwritten = 0
let fallback = 0

for (const file of files) {
  const code = path.basename(file, '.json')
  if (code === 'en') continue

  const filePath = path.join(localesDir, file)
  const obj = JSON.parse(readFileSync(filePath, 'utf8'))
  const table = loadTable(code)
  let changed = false

  for (const [key, enValue] of Object.entries(enContact)) {
    const current = obj.contact?.[key]
    const override = table[key]

    // An explicit translation always wins (used to fix English copies).
    if (override !== undefined) {
      if (current !== override) {
        obj.contact = obj.contact || {}
        obj.contact[key] = override
        changed = true
      }
      if (!current) {
        added++
        translated++
      } else if (current !== override) {
        overwritten++
      }
      continue
    }

    if (typeof current === 'string' && current.trim() !== '') continue

    const value = enValue
    obj.contact = obj.contact || {}
    obj.contact[key] = value
    added++
    changed = true
    fallback++
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(obj, null, 2))
    console.log(`${code}: contact keys synced`)
  } else {
    console.log(`${code}: already complete`)
  }
}

console.log(
  `\nAdded ${added} keys (${translated} with real translations, ${fallback} English fallback), ${overwritten} existing values replaced with real translations.`,
)
