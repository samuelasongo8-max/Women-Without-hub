import { spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const port = 9333

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,900',
  '--user-data-dir=C:/Users/Student/Desktop/Women wihout border/.screenshots/cdp-profile',
  url,
], { stdio: 'ignore' })

await wait(3000)

const res = await fetch(`http://127.0.0.1:${port}/json/list`)
const targets = await res.json()
const page = targets.find(t => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)

let id = 0
const pending = new Map()
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result)
    pending.delete(msg.id)
  }
}

await new Promise((r) => (ws.onopen = r))
await wait(2500)

const expression = `(() => {
  const band = document.querySelector('.image-band');
  const overlay = document.querySelector('.image-band__overlay');
  const img = document.querySelector('.image-band__img');
  const r = band ? band.getBoundingClientRect() : null;
  const ro = overlay ? overlay.getBoundingClientRect() : null;
  return JSON.stringify({
    bandHeight: r ? r.height : null,
    bandTop: r ? r.top : null,
    overlayHeight: ro ? ro.height : null,
    overlayTop: ro ? ro.top : null,
    imgHeight: img ? img.getBoundingClientRect().height : null,
    docHeight: document.documentElement.scrollHeight,
    h1: document.querySelector('h1')?.textContent,
    crumbs: [...document.querySelectorAll('.breadcrumbs li')].map(l=>l.textContent),
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content,
    robots: document.querySelector('meta[name=robots]')?.content,
    ogSite: document.querySelector('meta[property="og:site_name"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogType: document.querySelector('meta[property="og:type"]')?.content,
    canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
    h2s: [...document.querySelectorAll('h2')].map(h=>h.textContent),
    ldjson: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent.slice(0,300)),
  });
})()`

const r = await send('Runtime.evaluate', { expression, returnByValue: true })
console.log(JSON.stringify(JSON.parse(r.result.value), null, 2))

ws.close()
chrome.kill()
process.exit(0)
