import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { stelaDevPlugin } from './vite-plugin-stela.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), stelaDevPlugin()],
  build: {
    // Keep unused font subsets out of the critical stylesheet.
    assetsInlineLimit: (file) => file.endsWith('.woff2') ? false : undefined,
  },
})
