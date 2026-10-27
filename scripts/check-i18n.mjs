import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const localeDirectory = path.join(root, 'src', 'locales')
const chatbotLocaleDirectory = path.join(root, 'src', 'chatbot', 'locales')
const sourceDirectory = path.join(root, 'src')
const englishPath = path.join(localeDirectory, 'en.json')
const chatbotEnglishPath = path.join(chatbotLocaleDirectory, 'en.json')
const errors = []
const namespaceFilter = process.argv.includes('--ns')
  ? process.argv[process.argv.indexOf('--ns') + 1]
  : null

if (process.argv.includes('--ns') && !namespaceFilter) {
  console.error('Usage: npm run check:i18n -- --ns <namespace>')
  process.exit(1)
}

function flatten(value, prefix = '', output = {}) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, output)
    }
  } else if (Array.isArray(value)) {
    value.forEach((child, index) => {
      flatten(child, `${prefix}.${index}`, output)
    })
  } else {
    output[prefix] = value
  }
  return output
}

function readLocale(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    errors.push(`${path.relative(root, file)}: ${error.message}`)
    return null
  }
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) return filesUnder(file)
    return /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [file] : []
  })
}

function namespaceFor(key) {
  const [first, second, third] = key.split('.')
  if (first === 'programs') {
    if (second === 'livelihood') return 'programs.livelihood'
    if (second === 'cards' && third) return `programs.${third}`
    if (second === 'srhrDetail') return 'programs.srhr'
    return 'programs'
  }
  if (first === 'getInvolvedCards' || first === 'involvement') {
    return 'getInvolved'
  }
  if (
    first === 'homeHero' ||
    first === 'homePage' ||
    first.startsWith('quote') ||
    first === 'about' ||
    first === 'ourStory'
  ) {
    return 'home'
  }
  if (first === 'impact' || first === 'impactSection' || first === 'impactSectionPages') {
    return 'impact'
  }
  if (
    first === 'notFound' ||
    first === 'errors' ||
    first === 'validation' ||
    first === 'error'
  ) {
    return 'errors'
  }
  if (
    [
      'nav',
      'a11y',
      'lang',
      'breadcrumb',
      'search',
      'scroll',
      'brand',
    ].includes(first)
  ) {
    return 'nav'
  }
  if (
    [
      'donate',
      'getInvolved',
      'volunteer',
      'contact',
      'impact',
      'post',
      'report',
      'blogs',
      'chatbot',
      'common',
      'footer',
    ].includes(first)
  ) {
    return first
  }
  return 'common'
}

function includesNamespace(key) {
  if (!namespaceFilter) return true
  return (
    namespaceFor(key) === namespaceFilter ||
    key === namespaceFilter ||
    key.startsWith(`${namespaceFilter}.`)
  )
}

function reportLocale(code, english, locale, requiredKeys, stats) {
  for (const key of requiredKeys) {
    if (!includesNamespace(key)) continue
    const group = namespaceFor(key)
    const row = (stats[group] ??= { missing: 0, empty: 0, identical: 0 })
    if (!Object.hasOwn(locale, key)) {
      row.missing += 1
      errors.push(`${code}: missing locale key "${key}"`)
    } else if (
      locale[key] == null ||
      (typeof locale[key] === 'string' && !locale[key].trim())
    ) {
      row.empty += 1
      errors.push(`${code}: empty locale key "${key}"`)
    } else if (
      code !== 'en' &&
      Object.hasOwn(english, key) &&
      locale[key] === english[key]
    ) {
      row.identical += 1
    }
  }
}

const englishResource = readLocale(englishPath)
const chatbotEnglishResource = readLocale(chatbotEnglishPath)
if (!englishResource || !chatbotEnglishResource) process.exit(1)

const english = flatten(englishResource)
const chatbotEnglish = flatten(chatbotEnglishResource)
const localeFiles = fs
  .readdirSync(localeDirectory)
  .filter((name) => name.endsWith('.json'))
  .map((name) => path.join(localeDirectory, name))
const languageCodes = localeFiles.map((file) => path.basename(file, '.json'))
const chatbotFiles = new Map(
  fs
    .readdirSync(chatbotLocaleDirectory)
    .filter((name) => name.endsWith('.json'))
    .map((name) => [path.basename(name, '.json'), path.join(chatbotLocaleDirectory, name)]),
)

const usedKeys = new Set()
const literalKeyPattern = /\bt\(\s*(?:'([^']+)'|"([^"]+)"|`([^`$]+)`)/g
for (const file of filesUnder(sourceDirectory)) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(literalKeyPattern)) {
    usedKeys.add(match[1] ?? match[2] ?? match[3])
  }
}

const requiredKeys = new Set([...Object.keys(english), ...usedKeys])
const chatbotKeys = new Set([
  ...Object.keys(chatbotEnglish).map((key) => `chatbot.${key}`),
  ...[...usedKeys].filter((key) => key.startsWith('chatbot.')),
])
for (const key of chatbotKeys) requiredKeys.delete(key)

const summary = []
for (const file of localeFiles) {
  const code = path.basename(file, '.json')
  const localeResource = readLocale(file)
  if (!localeResource) continue
  const locale = flatten(localeResource)
  const stats = {}
  reportLocale(code, english, locale, requiredKeys, stats)

  const chatbotFile = chatbotFiles.get(code)
  const chatbotResource = chatbotFile ? readLocale(chatbotFile) : null
  const chatbotLocale = chatbotResource ? flatten(chatbotResource) : {}
  const chatbotEnglishKeys = new Set(
    Object.keys(chatbotEnglish).map((key) => `chatbot.${key}`),
  )
  const chatbotUsedKeys = new Set(
    [...usedKeys].filter((key) => key.startsWith('chatbot.')),
  )
  const chatbotRequired = new Set([...chatbotEnglishKeys, ...chatbotUsedKeys])
  const chatbotValues = Object.fromEntries(
    Object.entries(chatbotLocale).map(([key, value]) => [`chatbot.${key}`, value]),
  )
  const chatbotEnglishValues = Object.fromEntries(
    Object.entries(chatbotEnglish).map(([key, value]) => [`chatbot.${key}`, value]),
  )
  reportLocale(
    code,
    chatbotEnglishValues,
    chatbotValues,
    chatbotRequired,
    stats,
  )
  summary.push({ code, stats })
}

const groups = [...new Set(summary.flatMap(({ stats }) => Object.keys(stats)))].sort()
const columns = ['Language', 'Namespace', 'Missing', 'Empty', 'English-identical']
const widths = [10, 28, 8, 7, 18]
const formatRow = (values) =>
  `| ${values.map((value, index) => String(value).padEnd(widths[index])).join(' | ')} |`
const separator = `|-${widths.map((width) => '-'.repeat(width)).join('-|-')}-|`

console.log(`Translation completeness${namespaceFilter ? ` for "${namespaceFilter}"` : ''}`)
console.log(formatRow(columns))
console.log(separator)
for (const { code, stats } of summary) {
  for (const group of groups) {
    const row = stats[group] ?? { missing: 0, empty: 0, identical: 0 }
    if (!row.missing && !row.empty && !row.identical) continue
    console.log(
      formatRow([code, group, row.missing, row.empty, row.identical]),
    )
  }
  const total = Object.values(stats).reduce(
    (result, row) => ({
      missing: result.missing + row.missing,
      empty: result.empty + row.empty,
      identical: result.identical + row.identical,
    }),
    { missing: 0, empty: 0, identical: 0 },
  )
  console.log(
    formatRow([code, 'TOTAL', total.missing, total.empty, total.identical]),
  )
}

if (errors.length) {
  console.error(`\ni18n check failed with ${errors.length} issue(s):`)
  for (const error of [...new Set(errors)]) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`\ni18n check passed for ${localeFiles.length} locale files.`)
}
