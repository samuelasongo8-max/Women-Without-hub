/**
 * Locale parity audit.
 *
 * Reports, for every locale file in src/locales:
 *   - keys missing compared with English (the reference locale),
 *   - keys whose value is an empty / whitespace-only string,
 *   - keys whose value is not a string (wrong type),
 *   - extra keys that English does not have.
 *
 * Run with:  node scripts/locale-audit.mjs
 * Exits with code 1 when a locale is incomplete (useful in CI).
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.resolve(here, '..', 'src', 'locales')

/** Flatten a nested object into a map of dotted key -> value. */
function flatten(obj, prefix = '') {
  const out = {}
  for (const [key, value] of Object.entries(obj || {})) {
    const full = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flatten(value, full))
    } else {
      out[full] = value
    }
  }
  return out
}

const files = readdirSync(localesDir).filter((f) => f.endsWith('.json'))
const reference = flatten(JSON.parse(readFileSync(path.join(localesDir, 'en.json'), 'utf8')))
const referenceKeys = Object.keys(reference).sort()

let failed = false

for (const file of files) {
  const code = path.basename(file, '.json')
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path.join(localesDir, file), 'utf8'))
  } catch (error) {
    console.log(`${code}: INVALID JSON — ${error.message}`)
    failed = true
    continue
  }

  const flat = flatten(parsed)
  const keys = new Set(Object.keys(flat))

  const missing = referenceKeys.filter((k) => !keys.has(k))
  const empty = referenceKeys.filter((k) => keys.has(k) && typeof flat[k] === 'string' && flat[k].trim() === '')
  const wrongType = referenceKeys.filter((k) => keys.has(k) && typeof flat[k] !== 'string')
  const extra = Object.keys(flat).filter((k) => !(k in reference))

  console.log(
    `${code.padEnd(4)} keys=${String(keys.size).padEnd(5)} missing=${missing.length} empty=${empty.length} wrongType=${wrongType.length} extra=${extra.length}`,
  )
  if (missing.length) console.log(`     missing: ${missing.join(', ')}`)
  if (empty.length) console.log(`     empty:   ${empty.join(', ')}`)
  if (wrongType.length) console.log(`     type:    ${wrongType.join(', ')}`)
  if (extra.length) console.log(`     extra:   ${extra.join(', ')}`)

  if (missing.length || empty.length || wrongType.length) failed = true
}

process.exit(failed ? 1 : 0)
