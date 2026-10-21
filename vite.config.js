import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoFilesPlugin } from './scripts/seo-files.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seoFilesPlugin()],
  server: {
    port: 3000,
  },
})
