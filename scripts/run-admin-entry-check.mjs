import { spawnSync } from 'node:child_process'

const env = { ...process.env }
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const build = spawnSync(npm, ['run', 'build'], {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (build.error) throw build.error
if (build.status !== 0) process.exit(build.status ?? 1)

const browserCheck = spawnSync(process.execPath, ['scripts/admin-entry-browser-check.mjs'], {
  env,
  stdio: 'inherit',
})

if (browserCheck.error) throw browserCheck.error
process.exit(browserCheck.status ?? 1)
