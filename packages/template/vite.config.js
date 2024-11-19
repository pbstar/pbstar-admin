import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or 'modern'
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@PConfig': fileURLToPath(new URL('../../config', import.meta.url)),
      '@PUtils': fileURLToPath(new URL('../../utils', import.meta.url)),
      '@PComponents': fileURLToPath(new URL('../../components', import.meta.url)),
      '@PServer': fileURLToPath(new URL('../../server', import.meta.url)),
    }
  },
  server: {
    port: 8001,
  }
})
