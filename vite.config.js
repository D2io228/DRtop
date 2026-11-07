import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true },
  // OFFLINE_ASSETS=<dir> VITE_OFFLINE=1 builds a self-contained copy (images + map tiles bundled)
  publicDir: process.env.OFFLINE_ASSETS || 'public',
  build: { chunkSizeWarningLimit: 900, outDir: process.env.VITE_OFFLINE ? 'dist-offline' : 'dist' },
})
