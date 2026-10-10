import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { stelaDevPlugin } from './vite-plugin-stela.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), stelaDevPlugin()],
  build: {
    assetsInlineLimit: (file) => file.endsWith('.woff2') ? false : undefined,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/')) return 'react-vendor';
          if (id.includes('node_modules/gsap/')) return 'gsap-vendor';
          if (id.includes('node_modules/lenis/')) return 'lenis-vendor';
          if (id.includes('node_modules/@supabase/supabase-js/')) return 'supabase-vendor';
        },
      },
    },
  },
})
