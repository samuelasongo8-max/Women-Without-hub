import { spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const port = 9400 + Math.floor(Math.random() * 400)
// Unique profile per run, otherwise a running Chrome instance is reused
// and the check reads a stale tab instead of the requested URL.
const profile = `C:/Users/Student/Desktop/Women wihout border/.screenshots/cdp-seo-${port}`

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,900',
  `--user-data-dir=${profile}`,
  url,
], { stdio: 'ignore' })

await wait(3000)
const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
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
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id) }
}

await new Promise((r) => (ws.onopen = r))
await send('Runtime.enable')
await send('Page.enable')
await send('Page.reload', { ignoreCache: true })
await wait(3500)

const r = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    title: document.title,
    canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content ?? null,
    ogSiteName: document.querySelector('meta[property="og:site_name"]')?.content ?? null,
    robots: document.querySelector('meta[name=robots]')?.content ?? null,
    description: document.querySelector('meta[name=description]')?.content?.slice(0,90) ?? null,
    orgSchemaName: (() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      if (!el) return null;
      try { return JSON.parse(el.textContent).name ?? null; } catch { return 'PARSE_ERROR'; }
    })(),
  })`,
  returnByValue: true,
})
console.log(JSON.stringify(JSON.parse(r.result.value), null, 2))

ws.close(); chrome.kill(); process.exit(0)
