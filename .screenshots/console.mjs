import { spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const w = Number(process.argv[3] || 1440)
const h = Number(process.argv[4] || 900)
// Unique port + profile per run, otherwise runs in sequence/parallel
// collide and a running Chrome instance is reused, reading a stale tab.
const port = 9900 + Math.floor(Math.random() * 90)
const profile = `C:/Users/Student/Desktop/Women wihout border/.screenshots/cdp-console-${port}`

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--window-size=${w},${h}`,
  `--user-data-dir=${profile}`,
  url,
], { stdio: 'ignore' })

await wait(3000)
const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const page = targets.find(t => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)

let id = 0
const pending = new Map()
const logs = []
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); return }
  if (msg.method === 'Runtime.consoleAPICalled') {
    logs.push(`[console.${msg.params.type}] ` + msg.params.args.map(a => a.value ?? a.description ?? '').join(' '))
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${msg.params.exceptionDetails.text} ${msg.params.exceptionDetails.exception?.description ?? ''}`)
  }
  if (msg.method === 'Log.entryAdded' && ['error','warning'].includes(msg.params.entry.level)) {
    logs.push(`[${msg.params.entry.level}] ${msg.params.entry.text} ${msg.params.entry.url ?? ''}`)
  }
}

await new Promise((r) => (ws.onopen = r))
await send('Runtime.enable')
await send('Log.enable')
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: w,
  height: h,
  deviceScaleFactor: 1,
  mobile: w < 700,
})
await send('Page.reload', { ignoreCache: true })
await wait(4000)

// Check for horizontal overflow
const r = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    brokenImgs: [...document.images].filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src),
  })`,
  returnByValue: true,
})
console.log('LAYOUT:', r.result.value)
console.log('CONSOLE LOGS:', logs.length ? logs.join('\n') : '(none)')

ws.close(); chrome.kill(); process.exit(0)
