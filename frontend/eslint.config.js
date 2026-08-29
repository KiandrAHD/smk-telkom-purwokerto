import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Berkas yang jalan di Node, bukan di browser: konfigurasi Vite, plugin dev
    // server, dan skrip perkakas. Tanpa blok ini `process` dianggap tidak
    // dikenal, dan berkas .mjs tidak ikut terperiksa sama sekali.
    files: ['vite.config.js', 'vite-plugin-stela.js', 'scripts/**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Skrip perkakas memang berkomunikasi lewat konsol.
      'no-console': 'off',
    },
  },
])
