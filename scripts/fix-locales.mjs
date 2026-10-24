import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const localesDir = path.resolve('src/locales')
const en = JSON.parse(readFileSync(path.join(localesDir, 'en.json'), 'utf8'))

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) {
    const full = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, full))
    else out[full] = v
  }
  return out
}

function unflatten(flat) {
  const root = {}
  for (const [full, v] of Object.entries(flat)) {
    const parts = String(full).split('.')
    let cur = root
    for (let i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = v
  }
  return root
}

const refFlat = flatten(en)
const DROP_ABOUT = new Set(['about.breadcrumbAbout', 'about.statLabel', 'about.heroAlt'])

let changed = 0

for (const file of readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const code = file.replace('.json', '')
  const p = path.join(localesDir, file)
  let obj
  try { obj = JSON.parse(readFileSync(p, 'utf8')) } catch (e) { console.log(code, 'INVALID JSON', e.message); continue }

  // --- pl / ru: rebuild about section (keep their translations) -------
  if (code === 'pl' || code === 'ru') {
    const oldAbout = obj.about || {}
    const keep = ['heading', 'paragraph', 'card1Label', 'card1Desc', 'card2Label', 'card2Desc', 'card3Label', 'card3Desc', 'card4Label', 'card4Desc']
    const newAbout = {}
    for (const k of keep) if (typeof oldAbout[k] === 'string' && oldAbout[k].trim()) newAbout[k] = oldAbout[k]
    const enAbout = en.about || {}
    for (const [k, v] of Object.entries(enAbout)) {
      if (k === 'ourTeam') continue
      if (!(k in newAbout)) newAbout[k] = v
    }
    newAbout.ourTeam = enAbout.ourTeam
    obj.about = newAbout
  }

  const flat = flatten(obj)
  for (const [key, enValue] of Object.entries(refFlat)) {
    if (DROP_ABOUT.has(key)) continue
    const cur = flat[key]
    if (!(key in flat) || cur === '' || typeof cur !== 'string') {
      flat[key] = enValue
      changed++
    }
  }

  const out = unflatten(flat)
  writeFileSync(p, JSON.stringify(out, null, 2))
}

console.log('Fixed/filled', changed, 'locale values across', readdirSync(localesDir).filter((f) => f.endsWith('.json')).length, 'locale files')
