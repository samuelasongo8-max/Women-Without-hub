import { spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const port = 9500 + Math.floor(Math.random() * 80)
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${port}`,'--window-size=1440,900',`--user-data-dir=C:/Users/Student/Desktop/Women wihout border/.screenshots/cdp-crumb-${port}`,url], { stdio: 'ignore' })
await wait(3000)
const t = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const page = t.find(x => x.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0; const pending = new Map()
const send = (m, p = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })) })
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) } }
await new Promise(r => (ws.onopen = r))
await send('Page.enable'); await send('Runtime.enable')
await send('Page.navigate', { url })
await wait(6000)
const expr = `JSON.stringify({
  href: location.href,
  bodyLen: document.body.innerText.length,
  bodyStart: document.body.innerText.slice(0,120),
  crumbItems: [...document.querySelectorAll('nav.breadcrumbs li')].map(li => li.textContent.trim()),
  h1: document.querySelector('h1')?.textContent.trim().slice(0,100) ?? null,
  eyebrow: document.querySelector('.mlp-eyebrow')?.textContent.trim() ?? null,
  introHasFullName: document.querySelector('.mlp-intro')?.textContent.includes('Women Without Borders Hub') ?? null,
  bodyHasShortName: document.body.innerText.includes('Women Without Hub') ?? null,
})`
const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
console.log(JSON.stringify(JSON.parse(r.result.value), null, 2))
ws.close(); chrome.kill(); process.exit(0)
