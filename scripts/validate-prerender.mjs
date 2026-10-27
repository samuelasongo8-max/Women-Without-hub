import { readFile } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
)
const issues = []
const titles = new Map()
const descriptions = new Map()
const shareImageRoutes = new Set([
  '/',
  '/updates/building-pathways-for-women-and-girls/',
  '/updates/graduation-celebration-skills/',
  '/updates/health-advocacy/',
])

function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ])
  let offset = 2

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null
    while (buffer[offset] === 0xff) offset += 1

    const marker = buffer[offset]
    offset += 1
    if (marker === 0xd9 || marker === 0xda) break
    if (marker >= 0xd0 && marker <= 0xd7) continue

    const segmentLength = buffer.readUInt16BE(offset)
    if (startOfFrameMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }
    offset += segmentLength
  }

  return null
}

if (locations.length === 0) {
  throw new Error('The generated sitemap contains no routes.')
}

for (const location of locations) {
  const url = new URL(location)
  const route = url.pathname
  const relativePath =
    route === '/' ? 'index.html' : `${route.slice(1)}index.html`
  const file = path.join(dist, relativePath)
  let html

  try {
    html = await readFile(file, 'utf8')
  } catch {
    issues.push(`${route}: static HTML file is missing`)
    continue
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  const description = html.match(
    /<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']*)["'][^>]*>/i,
  )?.[1]
  const canonical = html.match(
    /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']*)["'][^>]*>/i,
  )?.[1]
  const ogImage = html.match(
    /<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*\bcontent=["']([^"']*)["'][^>]*>/i,
  )?.[1]
  const body =
    html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]?.replace(
      /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
      '',
    ) || ''
  const bodyText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const h1Count = [...body.matchAll(/<h1\b/gi)].length

  if (!title) {
    issues.push(`${route}: page title is missing`)
  } else if (titles.has(title)) {
    issues.push(`${route}: duplicate title also used on ${titles.get(title)}`)
  } else {
    titles.set(title, route)
  }

  if (!description) {
    issues.push(`${route}: meta description is missing`)
  } else if (descriptions.has(description)) {
    issues.push(
      `${route}: duplicate description also used on ${descriptions.get(description)}`,
    )
  } else {
    descriptions.set(description, route)
  }

  if (canonical !== location) {
    issues.push(`${route}: canonical does not match sitemap URL`)
  }
  if (!ogImage) issues.push(`${route}: Open Graph image is missing`)
  if (shareImageRoutes.has(route) && ogImage) {
    try {
      const imageUrl = new URL(ogImage)
      const imageFile = path.join(dist, imageUrl.pathname.replace(/^\/+/, ''))
      const dimensions = jpegDimensions(await readFile(imageFile))
      if (dimensions?.width !== 1200 || dimensions?.height !== 630) {
        issues.push(
          `${route}: Open Graph image must be JPEG 1200x630 (${dimensions ? `${dimensions.width}x${dimensions.height}` : 'invalid image'})`,
        )
      }
    } catch {
      issues.push(`${route}: Open Graph image must be an absolute URL to a built asset`)
    }
  }
  if (bodyText.length < 200) {
    issues.push(`${route}: rendered body text is too short (${bodyText.length} chars)`)
  }
  if (h1Count !== 1) {
    issues.push(`${route}: expected exactly one H1, found ${h1Count}`)
  }
}

if (issues.length) {
  console.error(`Prerender validation failed with ${issues.length} issue(s):`)
  for (const issue of issues) console.error(`- ${issue}`)
  process.exitCode = 1
} else {
  console.log(`Validated full HTML and unique SEO metadata for ${locations.length} routes.`)
}
