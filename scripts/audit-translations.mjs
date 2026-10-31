import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mainDirectory = path.join(root, 'src', 'locales')
const chatbotDirectory = path.join(root, 'src', 'chatbot', 'locales')
const siteAllowlistedKeys = new Set([
  'brand.name',
  'nav.orgName',
  'contact.brandName',
  'programs.livelihood.organizationName',
  'quoteFeature.name',
  'quoteSection.name',
  'quoteSection.name2',
])

function flatten(value, prefix = '', output = {}) {
  if (Array.isArray(value)) {
    value.forEach((child, index) => {
      flatten(child, `${prefix}.${index}`, output)
    })
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, output)
    }
  } else {
    output[prefix] = value
  }
  return output
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function compareShape(expected, actual, prefix = '', differences = []) {
  const key = prefix || '(root)'
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      differences.push(`${key}: expected array`)
      return differences
    }
    if (expected.length !== actual.length) {
      differences.push(`${key}: expected array length ${expected.length}, got ${actual.length}`)
    }
    expected.forEach((value, index) => {
      compareShape(value, actual[index], `${prefix}[${index}]`, differences)
    })
    return differences
  }

  if (expected && typeof expected === 'object') {
    if (!actual || typeof actual !== 'object' || Array.isArray(actual)) {
      differences.push(`${key}: expected object`)
      return differences
    }
    const expectedKeys = Object.keys(expected)
    const actualKeys = Object.keys(actual)
    for (const child of expectedKeys) {
      compareShape(
        expected[child],
        actual[child],
        prefix ? `${prefix}.${child}` : child,
        differences,
      )
    }
    for (const child of actualKeys) {
      if (!(child in expected)) {
        differences.push(`${prefix ? `${prefix}.` : ''}${child}: unexpected key`)
      }
    }
    return differences
  }

  if (actual === undefined || actual === null || typeof actual !== typeof expected) {
    differences.push(`${key}: value type differs`)
  }
  return differences
}

function auditSet(directory, namespace, allowlistedKeys) {
  const englishSource = readJson(path.join(directory, 'en.json'))
  const english = flatten(englishSource)
  const files = fs
    .readdirSync(directory)
    .filter((name) => name.endsWith('.json') && name !== 'en.json')
  let failed = false

  for (const file of files) {
    const language = path.basename(file, '.json')
    const localeSource = readJson(path.join(directory, file))
    const locale = flatten(localeSource)
    const missing = Object.keys(english).filter((key) => !(key in locale))
    const extra = Object.keys(locale).filter((key) => !(key in english))
    const empty = Object.keys(english).filter(
      (key) => typeof locale[key] === 'string' && !locale[key].trim(),
    )
    const identical = Object.keys(english).filter(
      (key) =>
        typeof english[key] === 'string' &&
        locale[key] === english[key] &&
        !allowlistedKeys.has(key),
    )
    const allowlistedIdentical = Object.keys(english).filter(
      (key) =>
        allowlistedKeys.has(key) &&
        typeof english[key] === 'string' &&
        locale[key] === english[key],
    )
    const changedAllowlisted = [...allowlistedKeys].filter(
      (key) => key in english && locale[key] !== english[key],
    )
    const shapeDifferences = compareShape(englishSource, localeSource)

    console.log(
      `${namespace}/${language}: keys=${Object.keys(locale).length}, missing=${missing.length}, extra=${extra.length}, empty=${empty.length}, identical=${identical.length}, allowed-identical=${allowlistedIdentical.length}, shape=${shapeDifferences.length}`,
    )
    for (const key of missing) console.error(`  missing ${key}`)
    for (const key of extra) console.error(`  extra ${key}`)
    for (const key of empty) console.error(`  empty ${key}`)
    for (const key of identical) console.error(`  untranslated ${key}`)
    for (const key of changedAllowlisted) {
      console.error(`  changed allowlisted name ${key}`)
    }
    for (const difference of shapeDifferences) {
      console.error(`  shape ${difference}`)
    }
    if (
      missing.length ||
      extra.length ||
      empty.length ||
      identical.length ||
      changedAllowlisted.length ||
      shapeDifferences.length
    ) {
      failed = true
    }
  }

  return failed
}

const chatbotAllowlistedKeys = new Set()

for (const [namespace, keys] of [
  ['site', siteAllowlistedKeys],
  ['chatbot', chatbotAllowlistedKeys],
]) {
  console.log(`${namespace} identical-value allowlist (${keys.size} keys):`)
  for (const key of keys) console.log(`  ${key}`)
}

const failed =
  auditSet(mainDirectory, 'site', siteAllowlistedKeys) |
  auditSet(chatbotDirectory, 'chatbot', chatbotAllowlistedKeys)
process.exit(failed ? 1 : 0)
