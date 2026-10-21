/**
 * SEO FILE GENERATION — Women Without Borders Hub
 *
 * Generates `robots.txt` and `sitemap.xml` from a single source of truth:
 * the route table in `src/data/site.js` and the configured site origin.
 *
 * The origin comes from the `VITE_SITE_URL` environment variable (see
 * `normalizeSiteUrl` in src/data/seo.js). When it is not configured we
 * MUST NOT invent a domain, so:
 *  - `robots.txt` is published WITHOUT a `Sitemap:` line (a sitemap
 *    pointing at a placeholder domain is worse than no sitemap at all),
 *  - `sitemap.xml` is NOT published.
 *
 * Both files are written into the build output directory (`dist/`) after
 * the bundle is written, and are also served in `npm run dev`.
 */

import { writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'
import { routeMeta } from '../src/data/site.js'

/**
 * The pages that belong in the sitemap, in priority order.
 *
 * `routeMeta` already lists every indexable route with its trailing
 * slash. Removed pages (/stories/, /impact/our-story/) are intentionally
 * excluded — they only exist as redirects now.
 */
function sitemapPaths() {
  return Object.keys(routeMeta)
    .sort((a, b) => {
      // Home first, then alphabetical for a stable, readable order.
      if (a === '/') return -1
      if (b === '/') return 1
      return a.localeCompare(b)
    })
}

/** Build the sitemap.xml body for a given absolute origin. */
export function buildSitemap(origin) {
  const urls = sitemapPaths()
    .map((p) => {
      const loc = `${origin}${p}`
      const priority = p === '/' ? '<priority>1.0</priority>' : ''
      return `  <url><loc>${loc}</loc>${priority}</url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap.xml — Women Without Borders Hub
  Generated at build time from src/data/site.js (routeMeta).
  Trailing slashes are kept because the site uses trailing-slash routes.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/** Build the robots.txt body for a given absolute origin (or null). */
export function buildRobots(origin) {
  const sitemapLine = origin
    ? `Sitemap: ${origin}/sitemap.xml`
    : '# No sitemap is published yet: set VITE_SITE_URL to the live domain.'

  return `# robots.txt — Women Without Borders Hub
# Allow all crawlers to index the whole site.
User-agent: *
Allow: /

${sitemapLine}
`
}

/**
 * Resolve the configured site origin, or null when none is configured.
 * Mirrors `normalizeSiteUrl` in src/data/seo.js.
 *
 * The value is read from Vite's loaded env (which includes the `.env`
 * files) — NOT from `process.env` directly, because Vite only exposes
 * `.env` values through `import.meta.env` / `loadEnv`. Reading
 * `process.env` here would silently miss a domain configured in `.env`.
 */
function resolveOrigin(env) {
  const raw = env?.VITE_SITE_URL
  if (!raw || !raw.trim()) return null

  let value = raw.trim()
  if (/^https?:\/\/YOUR-DOMAIN$/i.test(value) || /^YOUR-DOMAIN$/i.test(value)) {
    return null
  }
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`

  try {
    const url = new URL(value)
    return `https://${url.host}`
  } catch {
    return null
  }
}

/**
 * Vite plugin: serves robots.txt / sitemap.xml in dev and writes them
 * into the build output afterwards.
 */
export function seoFilesPlugin({ outDir = 'dist' } = {}) {
  // Load the .env files the same way Vite does, so the plugin sees the
  // exact same VITE_SITE_URL value as the client bundle.
  let env = {}

  return {
    name: 'women-hub-seo-files',

    configResolved(config) {
      env = loadEnv(config.mode, config.root ?? process.cwd(), '')
    },

    // Dev server: serve the files from memory.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const origin = resolveOrigin(env)

        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(buildRobots(origin))
          return
        }

        if (url === '/sitemap.xml') {
          if (!origin) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end('Sitemap is not published until VITE_SITE_URL is set.')
            return
          }
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(buildSitemap(origin))
          return
        }

        next()
      })
    },

    // Build: write the files into the output directory.
    async closeBundle() {
      const origin = resolveOrigin(env)
      const dir = path.resolve(process.cwd(), outDir)

      await writeFile(path.join(dir, 'robots.txt'), buildRobots(origin), 'utf8')

      if (origin) {
        await writeFile(
          path.join(dir, 'sitemap.xml'),
          buildSitemap(origin),
          'utf8',
        )
      } else {
        // Remove any stale sitemap so a placeholder is never published.
        await rm(path.join(dir, 'sitemap.xml'), { force: true })
      }
    },
  }
}
