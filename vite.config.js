import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { seoFilesPlugin } from './scripts/seo-files.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backendURL = env.VITE_API_URL || 'http://localhost:4000'

  console.log('[VITE] Proxy target →', backendURL)

  return {
    plugins: [react(), seoFilesPlugin()],

    server: {
      port: 3001,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendURL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          configure: (proxy) => {
            proxy.on('error', (err, req) => {
              console.error('[PROXY ERROR]', req.method, req.url, '→', err.message)
            })
            proxy.on('proxyReq', (_, req) => {
              console.log('[PROXY →]', req.method, req.url, '→', backendURL)
            })
            proxy.on('proxyRes', (res, req) => {
              console.log('[PROXY ←]', res.statusCode, req.url)
            })
          },
        },
      },
    },
  }
})
