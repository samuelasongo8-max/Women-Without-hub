import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

const dist = path.resolve('dist')
const secretPath = `/manage/${randomUUID()}`
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

const vercel = JSON.parse(await readFile('vercel.json', 'utf8'))
for (const privateSource of ['/manage', '/manage/(.*)']) {
  const privateHeaders = vercel.headers.find((entry) => entry.source === privateSource)
  assert.ok(privateHeaders, `Vercel must attach private-route headers for ${privateSource}`)
  assert.ok(privateHeaders.headers.some(({ key, value }) => key === 'X-Robots-Tag' && value === 'noindex, nofollow'))
}
assert.ok(vercel.rewrites.some(({ source, destination }) => source === '/manage' && destination === '/admin-entry-shell.html'))
assert.ok(vercel.rewrites.some(({ source, destination }) => source === '/manage/(.*)' && destination === '/admin-entry-shell.html'))

const shell = await readFile(path.join(dist, 'admin-entry-shell.html'), 'utf8')
assert.match(shell, /<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/?\s*>/i)
const publicHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
assert.match(publicHtml, /<meta\s+name="robots"\s+content="index, follow"\s*\/?\s*>/i)
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
assert.doesNotMatch(sitemap, /manage|admin-entry-shell/i)
const bundles = await readdir(path.join(dist, 'assets'))
for (const bundle of bundles.filter((name) => name.endsWith('.js'))) {
  const source = await readFile(path.join(dist, 'assets', bundle), 'utf8')
  assert.equal(source.includes('PRIVATE_ADMIN_PATH'), false, 'private path configuration must stay backend-only')
  assert.equal(source.includes(secretPath), false, 'test private path must not be present in frontend bundles')
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (pathname.startsWith('/api/admin/private-entry-check')) {
    const allowed = req.headers['x-private-admin-path'] === secretPath
    res.writeHead(allowed ? 200 : 404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    return res.end(JSON.stringify({ ok: allowed }))
  }
  if (pathname === '/api/admin/me') {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ ok: false }))
  }
  if (pathname.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ updates: [], posts: [], blogs: [], reports: [] }))
  }

  const isPrivateRoute = pathname === '/manage' || pathname.startsWith('/manage/')
  let file = isPrivateRoute
    ? path.join(dist, 'admin-entry-shell.html')
    : pathname === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, pathname.replace(/^\/+/, ''))
  if (!isPrivateRoute && !pathname.endsWith('.js') && !pathname.endsWith('.css')) {
    try {
      const statPath = await import('node:fs/promises').then(({ stat }) => stat(file))
      if (statPath.isDirectory()) file = path.join(file, 'index.html')
    } catch {
      file = path.join(dist, 'index.html')
    }
  }
  try {
    const body = await readFile(file)
    const headers = { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' }
    if (isPrivateRoute) {
      headers['X-Robots-Tag'] = 'noindex, nofollow'
      headers['Cache-Control'] = 'private, no-store'
    }
    res.writeHead(200, headers)
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(0, '127.0.0.1')
await new Promise((resolve) => server.once('listening', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
let browser

try {
  const localChromeCandidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)
  const localChrome = localChromeCandidates.find((candidate) => existsSync(candidate))
  browser = await puppeteer.launch({
    executablePath: localChrome || await chromium.executablePath(),
    args: localChrome
      ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      : chromium.args,
    headless: true,
    defaultViewport: { width: 1280, height: 900 },
  })
  const page = await browser.newPage()
  const privateEntryChecks = []
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin === origin && url.pathname.startsWith('/api/')) {
      const headers = request.headers()
      if (url.pathname === '/api/admin/private-entry-check') {
        privateEntryChecks.push(headers['x-private-admin-path'])
        const isAllowed = headers['x-private-admin-path'] === secretPath
        request.respond({ status: isAllowed ? 200 : 404, contentType: 'application/json', body: JSON.stringify({ ok: isAllowed }) })
      } else if (url.pathname === '/api/admin/me') {
        request.respond({ status: 401, contentType: 'application/json', body: JSON.stringify({ ok: false }) })
      } else {
        request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ updates: [], posts: [], blogs: [], reports: [] }) })
      }
    } else if (url.origin !== origin) {
      request.abort()
    } else {
      request.continue()
    }
  })

  const wrongResponse = await page.goto(`${origin}/manage/not-the-secret`, { waitUntil: 'networkidle0' })
  assert.equal(wrongResponse.status(), 200)
  assert.equal(wrongResponse.headers()['x-robots-tag'], 'noindex, nofollow')
  assert.match(await page.$eval('h1', (el) => el.textContent), /not found/i)
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 0)
  assert.ok(privateEntryChecks.length > 0)
  assert.ok(privateEntryChecks.every((path) => path === '/manage/not-the-secret'))
  const checksAfterWrongPath = privateEntryChecks.length

  const bareManageResponse = await page.goto(`${origin}/manage`, { waitUntil: 'networkidle0' })
  assert.equal(bareManageResponse.headers()['x-robots-tag'], 'noindex, nofollow')
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 0)
  assert.equal(privateEntryChecks.length, checksAfterWrongPath)

  await page.goto(`${origin}/an-unknown-public-looking-route`, { waitUntil: 'networkidle0' })
  assert.match(await page.$eval('h1', (el) => el.textContent), /not found/i)
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 0)
  assert.equal(privateEntryChecks.length, checksAfterWrongPath)

  const checksBeforePrivatePath = privateEntryChecks.length
  const privateResponse = await page.goto(`${origin}${secretPath}`, { waitUntil: 'networkidle0' })
  assert.ok(privateEntryChecks.length > checksBeforePrivatePath)
  assert.ok(privateEntryChecks.slice(checksBeforePrivatePath).every((path) => path === secretPath))
  assert.equal(privateResponse.status(), 200)
  assert.equal(privateResponse.headers()['x-robots-tag'], 'noindex, nofollow')
  assert.match(await page.$eval('h1', (el) => el.textContent), /sign in/i)
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 1)
  assert.equal(await page.$eval('h1', (el) => el.textContent), 'Sign in')

  await page.goto(`${origin}/manage/session`, { waitUntil: 'networkidle0' })
  await page.waitForFunction((expected) => window.location.href === expected, {}, `${origin}/`)
  assert.equal(await page.$$eval('.admin-dashboard', (elements) => elements.length), 0)

  const homeResponse = await page.goto(origin, { waitUntil: 'networkidle0' })
  assert.equal(homeResponse.status(), 200)
  assert.equal(homeResponse.headers()['x-robots-tag'], undefined)
  assert.match(await page.$eval('h1', (el) => el.textContent), /.+/)
  assert.equal(await page.$$eval('a[href*="/manage"]', (links) => links.length), 0)

  console.log('Admin entry browser checks passed: wrong path, correct path, direct dashboard, initial noindex, and public homepage.')
} finally {
  if (browser) await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}
