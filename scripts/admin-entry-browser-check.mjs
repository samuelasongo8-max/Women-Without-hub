import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

const dist = path.resolve('dist')
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
  assert.doesNotMatch(source, /PRIVATE_ADMIN_PATH|private-entry-link|private-entry-check/i)
  assert.doesNotMatch(source, /ADMIN_REGISTER_KEY|JWT_SECRET|MONGODB_URI/)
}

let authenticated = false
let registrationRequest
const apiRequestPaths = []
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (pathname.startsWith('/api/')) apiRequestPaths.push(`${req.method} ${pathname}`)
  if (pathname === '/api/admin/me') {
    res.writeHead(authenticated ? 200 : 401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(authenticated ? { ok: true, username: 'admin@example.test' } : { ok: false }))
  }
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    const credentials = JSON.parse(body || '{}')
    authenticated = credentials.email === 'admin@example.test' && credentials.password === 'test-only-password'
    res.writeHead(authenticated ? 200 : 401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(authenticated ? { ok: true, username: 'admin@example.test' } : { ok: false, message: 'Invalid credentials' }))
  }
  if (pathname === '/api/admin/register' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    registrationRequest = {
      body: JSON.parse(body || '{}'),
      registrationKey: req.headers['x-admin-registration-key'],
    }
    const authorized = registrationRequest.registrationKey === 'test-only-owner-registration-key'
      && registrationRequest.body.email === 'owner@example.test'
    res.writeHead(authorized ? 201 : 403, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(authorized ? { ok: true } : { ok: false, message: 'Registration is unavailable' }))
  }
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    authenticated = false
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ ok: true }))
  }
  if (pathname.startsWith('/api/admin/content/')) {
    res.writeHead(authenticated ? 200 : 401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ updates: [], posts: [], blogs: [], reports: [] }))
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
  const browserConsoleMessages = []
  const browserPageErrors = []
  const browserApiRequests = []
  page.on('console', (message) => browserConsoleMessages.push(message.text()))
  page.on('pageerror', (error) => browserPageErrors.push(error.message))
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.pathname.startsWith('/api/')) browserApiRequests.push(`${request.method()} ${url.origin}${url.pathname}`)
    if (url.origin !== origin) request.abort()
    else request.continue()
  })

  async function fillReactInput(selector, value) {
    await page.$eval(selector, (element, nextValue) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
      setter.call(element, nextValue)
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }, value)
  }

  const wrongPathResponse = await page.goto(`${origin}/manage/unknown`, { waitUntil: 'networkidle0' })
  assert.equal(wrongPathResponse.status(), 200)
  assert.equal(wrongPathResponse.headers()['x-robots-tag'], 'noindex, nofollow')
  assert.match(await page.$eval('h1', (el) => el.textContent), /not found/i)
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 0)

  const loginResponse = await page.goto(`${origin}/manage`, { waitUntil: 'networkidle0' })
  assert.equal(loginResponse.status(), 200)
  assert.equal(loginResponse.headers()['x-robots-tag'], 'noindex, nofollow')
  assert.equal(await page.$eval('h1', (el) => el.textContent), 'Sign in')
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 1)
  await page.reload({ waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('h1', (el) => el.textContent), 'Sign in')
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 1)

  await page.goto(`${origin}/an-unknown-public-looking-route`, { waitUntil: 'networkidle0' })
  assert.match(await page.$eval('h1', (el) => el.textContent), /not found/i)
  assert.equal(await page.$$eval('input[type="password"]', (elements) => elements.length), 0)

  await page.goto(`${origin}/manage/register`, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('h1', (el) => el.textContent), 'Create account')
  await fillReactInput('input[name="email"]', 'owner@example.test')
  await fillReactInput('input[name="registrationKey"]', 'test-only-owner-registration-key')
  await fillReactInput('input[name="password"]', 'a-secure-test-password')
  await fillReactInput('input[name="confirm"]', 'a-secure-test-password')
  const registrationFormState = await page.$eval('.admin-auth-form', (form) => ({
    valid: form.checkValidity(),
    fields: [...form.elements]
      .filter((element) => element.name)
      .map((element) => ({ name: element.name, valid: element.validity.valid, length: element.value.length })),
  }))
  assert.equal(registrationFormState.valid, true, JSON.stringify(registrationFormState))
  assert.deepEqual(await page.$eval('.admin-auth-form', (form) => Object.fromEntries(new FormData(form))), {
    email: 'owner@example.test',
    registrationKey: 'test-only-owner-registration-key',
    password: 'a-secure-test-password',
    confirm: 'a-secure-test-password',
  })
  await page.click('.admin-auth-form button')
  await new Promise((resolve) => setTimeout(resolve, 250))
  assert.ok(registrationRequest, `Registration request missing. Server API requests: ${JSON.stringify(apiRequestPaths)}; browser API requests: ${JSON.stringify(browserApiRequests)}; browser errors: ${JSON.stringify(browserPageErrors)}; console: ${JSON.stringify(browserConsoleMessages)}`)
  assert.deepEqual(registrationRequest, {
    body: { email: 'owner@example.test', password: 'a-secure-test-password' },
    registrationKey: 'test-only-owner-registration-key',
  })
  await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Account created', { timeout: 5000 })
  const storedValues = await page.evaluate(() => [
    ...Object.values(localStorage),
    ...Object.values(sessionStorage),
  ])
  assert.equal(storedValues.some((value) => value.includes('test-only-owner-registration-key')), false)
  await page.waitForFunction(() => window.location.pathname === '/manage')

  await page.goto(`${origin}/manage/session`, { waitUntil: 'networkidle0' })
  await page.waitForFunction((expected) => window.location.href === expected, {}, `${origin}/`)
  assert.equal(await page.$$eval('.admin-dashboard', (elements) => elements.length), 0)

  const homeResponse = await page.goto(origin, { waitUntil: 'networkidle0' })
  assert.equal(homeResponse.status(), 200)
  assert.equal(homeResponse.headers()['x-robots-tag'], undefined)
  assert.match(await page.$eval('h1', (el) => el.textContent), /.+/)
  const accessLink = await page.$('.footer-admin-access')
  assert.ok(accessLink, 'the footer must contain the administrator access icon')
  assert.equal(await accessLink.evaluate((element) => element.getAttribute('aria-label')), 'Administrator access')
  assert.equal(await accessLink.evaluate((element) => element.getAttribute('title')), 'Administrator access')
  assert.equal(await accessLink.evaluate((element) => element.textContent.trim()), '')
  assert.equal(await page.$eval('.footer-admin-access svg', (element) => element.getAttribute('aria-hidden')), 'true')
  assert.equal(await page.$$eval('a[href="/manage"]', (links) => links.length), 1)
  assert.equal(await accessLink.evaluate((element) => element.getAttribute('href')), '/manage')
  await accessLink.click()
  await page.waitForFunction(() => window.location.pathname === '/manage')
  await page.waitForSelector('.admin-auth-form')
  assert.equal(await page.$eval('h1', (el) => el.textContent), 'Sign in')

  await page.type('input[name="email"]', 'wrong@example.test')
  await page.type('input[name="password"]', 'wrong-test-password')
  await page.click('.admin-auth-form button')
  await page.waitForFunction(() => document.querySelector('[role="alert"]')?.textContent.includes('Invalid credentials'))
  assert.equal(new URL(page.url()).pathname, '/manage')

  await page.goto(`${origin}/manage`, { waitUntil: 'networkidle0' })
  await page.type('input[name="email"]', 'admin@example.test')
  await page.type('input[name="password"]', 'test-only-password')
  await page.click('.admin-auth-form button')
  await page.waitForFunction(() => window.location.pathname === '/manage/session')
  await page.waitForSelector('.admin-dashboard')
  assert.equal(new URL(page.url()).pathname, '/manage/session')
  await page.click('.admin-dashboard-logout')
  await page.waitForFunction(() => window.location.pathname === '/')
  assert.equal(await page.$$eval('.admin-dashboard', (elements) => elements.length), 0)
  await page.goto(`${origin}/manage/session`, { waitUntil: 'networkidle0' })
  await page.waitForFunction((expected) => window.location.href === expected, {}, `${origin}/`)
  assert.equal(await page.$$eval('.admin-dashboard', (elements) => elements.length), 0)

  await page.setViewport({ width: 390, height: 844 })
  await page.goto(origin, { waitUntil: 'networkidle0' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const mobileAccess = await page.$('.footer-admin-access')
  const mobileAccessBounds = await mobileAccess?.boundingBox()
  assert.ok(mobileAccessBounds && mobileAccessBounds.width >= 24 && mobileAccessBounds.height >= 24)
  assert.ok(mobileAccessBounds.x >= 0 && mobileAccessBounds.x + mobileAccessBounds.width <= 390)
  assert.equal(browserConsoleMessages.some((message) => /PRIVATE_ADMIN_PATH|private-entry-(link|check)/i.test(message)), false)

  console.log('Admin browser checks passed: footer icon, login, registration header handling, direct routes, refresh, dashboard protection, and logout.')
} finally {
  if (browser) await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}
