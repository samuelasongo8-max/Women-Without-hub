import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { preview, createServer } from 'vite'

const root = process.cwd()
const dist = path.join(root, 'dist')
const port = Number(process.env.PRERENDER_PORT || 4178)
const origin = `http://127.0.0.1:${port}`
const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

function upsertMeta(html, attribute, name, content) {
  const matcher = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${name}["'])[^>]*>`,
    'i',
  )
  const tag = `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(content)}" />`
  return matcher.test(html)
    ? html.replace(matcher, tag)
    : html.replace('</head>', `  ${tag}\n  </head>`)
}

function upsertCanonical(html, href) {
  const matcher = /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  return matcher.test(html)
    ? html.replace(matcher, tag)
    : html.replace('</head>', `  ${tag}\n  </head>`)
}

function routeOutputPath(route) {
  const relative = route === '/' ? 'index.html' : `${route.slice(1)}index.html`
  return path.join(dist, relative)
}

function buildRouteHtml(html, route, metadata, site) {
  const title = metadata.title || site.homeTitle
  let output = html.replace(
    /<title\b[^>]*>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  )

  output = upsertMeta(output, 'name', 'description', metadata.description)
  output = upsertMeta(
    output,
    'name',
    'robots',
    metadata.noindex ? 'noindex, nofollow' : 'index, follow',
  )
  output = upsertMeta(
    output,
    'property',
    'og:site_name',
    metadata.siteName || site.name,
  )
  output = upsertMeta(output, 'property', 'og:title', title)
  output = upsertMeta(output, 'property', 'og:description', metadata.description)
  output = upsertMeta(output, 'property', 'og:type', 'website')
  output = upsertMeta(output, 'property', 'og:locale', 'en_US')
  output = upsertMeta(output, 'name', 'twitter:card', 'summary_large_image')
  output = upsertMeta(output, 'name', 'twitter:title', title)
  output = upsertMeta(output, 'name', 'twitter:description', metadata.description)

  const image = metadata.ogImage || site.ogImage
  if (image) {
    const absoluteImage = site.url ? new URL(image, site.url).toString() : image
    output = upsertMeta(output, 'property', 'og:image', absoluteImage)
    output = upsertMeta(output, 'name', 'twitter:image', absoluteImage)
  }

  if (site.url && !metadata.noindex) {
    const canonical = new URL(route, site.url).toString()
    output = upsertCanonical(output, canonical)
    output = upsertMeta(output, 'property', 'og:url', canonical)
  }

  return output
}

function findLocalChrome() {
  const candidates =
    process.platform === 'win32'
      ? [
          process.env.CHROME_PATH,
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ]
      : process.platform === 'darwin'
        ? [
            process.env.CHROME_PATH,
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          ]
        : [
            process.env.CHROME_PATH,
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome',
          ]

  return candidates.find((candidate) => candidate && existsSync(candidate))
}

async function launchBrowser() {
  const localChrome = process.env.VERCEL ? null : findLocalChrome()
  const executablePath = localChrome || (await chromium.executablePath())
  const args = localChrome
    ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    : chromium.args

  return puppeteer.launch({
    executablePath,
    args,
    headless: true,
    defaultViewport: { width: 1440, height: 1000 },
  })
}

async function revealPageContent(page) {
  await page.waitForFunction(
    () => {
      const main = document.querySelector('#root .site-main')
      return main && (main.querySelector('h1') || main.innerText.trim())
    },
    { timeout: 20000 },
  )

  await page.evaluate(async () => {
    let position = 0
    let attempt = 0
    while (position < document.documentElement.scrollHeight && attempt < 60) {
      window.scrollTo({ top: position, behavior: 'instant' })
      await new Promise((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, 80)),
      )
      position += Math.max(1, window.innerHeight * 0.8)
      attempt += 1
    }
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    })
    await new Promise((resolve) =>
      requestAnimationFrame(() => setTimeout(resolve, 80)),
    )
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((resolve) => requestAnimationFrame(resolve))
  })

  await new Promise((resolve) => setTimeout(resolve, 250))
}

const vite = await createServer({
  configFile: path.join(root, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let server
let browser

try {
  const [{ seoFor, SITE }, { routeMeta }] = await Promise.all([
    vite.ssrLoadModule('/src/data/seo.js'),
    vite.ssrLoadModule('/src/data/site.js'),
  ])
  const routes = Object.keys(routeMeta)

  for (const route of routes) {
    const metadata = seoFor(route)
    if (!metadata.title || !metadata.description) {
      throw new Error(`Missing SEO metadata for ${route}`)
    }
  }

  server = await preview({
    configFile: path.join(root, 'vite.config.js'),
    preview: { host: '127.0.0.1', port, strictPort: true },
    logLevel: 'error',
  })
  browser = await launchBrowser()
  const errors = []

  for (const route of routes) {
    const page = await browser.newPage()
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('wwbh.lang', 'en')
    })
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      if (['image', 'font', 'media'].includes(request.resourceType())) {
        request.abort()
      } else {
        request.continue()
      }
    })

    try {
      const response = await page.goto(`${origin}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })
      if (!response?.ok()) {
        throw new Error(`Preview returned HTTP ${response?.status() ?? 'no response'}`)
      }

      await revealPageContent(page)
      const rendered = await page.evaluate(() => ({
        html: document.documentElement.outerHTML,
        bodyText: document.querySelector('#root')?.innerText.trim() || '',
        h1Count: document.querySelectorAll('#root h1').length,
      }))
      if (pageErrors.length) {
        throw new Error(`Browser error: ${pageErrors.join('; ')}`)
      }
      if (rendered.bodyText.length < 200) {
        throw new Error(`Rendered page text is too short (${rendered.bodyText.length} chars)`)
      }
      if (rendered.h1Count !== 1) {
        throw new Error(`Expected exactly one H1, found ${rendered.h1Count}`)
      }

      const outputPath = routeOutputPath(route)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(
        outputPath,
        buildRouteHtml(rendered.html, route, seoFor(route), SITE),
        'utf8',
      )
      console.log(`Prerendered ${route}`)
    } catch (error) {
      errors.push(`${route}: ${error.message}`)
    } finally {
      await page.close()
    }
  }

  if (errors.length) {
    throw new Error(`Prerender failed:\n${errors.join('\n')}`)
  }

  console.log(`Generated full static HTML for ${routes.length} routes.`)
} finally {
  if (browser) await browser.close()
  if (server?.httpServer) {
    await new Promise((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()))
    })
  }
  await vite.close()
}
