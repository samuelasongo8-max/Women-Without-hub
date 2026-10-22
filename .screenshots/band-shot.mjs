import { spawn } from 'node:child_process'
import { setTimeout as wait } from 'node:timers/promises'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const out = process.argv[3]
const w = Number(process.argv[4] || 1440)
// Unique port + profile per run, otherwise parallel runs collide and a
// running Chrome instance is reused, reading a stale tab.
const port = 9600 + Math.floor(Math.random() * 300)
const profile = `C:/Users/Student/Desktop/Women wihout border/.screenshots/cdp-band-${port}`

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--window-size=${w},900`,
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
await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 700 })
await send('Page.reload', { ignoreCache: true })
await wait(3000)

// scroll the band into view so the lazy image loads
await send('Runtime.evaluate', { expression: `document.querySelector('.image-band').scrollIntoView({block:'center'})` })
await wait(2500)

const r = await send('Runtime.evaluate', {
  expression: `(() => {
    const b = document.querySelector('.image-band');
    const i = document.querySelector('.image-band__img');
    const t = document.querySelector('.image-band__text');
    b.scrollIntoView({block:'center'});
    const rect = b.getBoundingClientRect();
    return JSON.stringify({
      bandH: rect.height,
      imgComplete: i?.complete, natural: i?.naturalWidth,
      textH: t?.getBoundingClientRect().height,
      textScrollH: t?.scrollHeight,
      fits: t ? t.scrollHeight <= rect.height : null,
    });
  })()`, returnByValue: true })
console.log('INFO:', r.result.value)

const box = await send('Runtime.evaluate', {
  expression: `(() => { const r = document.querySelector('.image-band').getBoundingClientRect();
    return JSON.stringify({x:0,y:r.top+window.scrollY,width:window.innerWidth,height:r.height}); })()`,
  returnByValue: true })
const clip = JSON.parse(box.result.value)
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 } })
fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
console.log('saved', out)

ws.close(); chrome.kill(); process.exit(0)
