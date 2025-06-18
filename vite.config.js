import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import svgLoader from 'vite-svg-loader'
// import * as path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  build: {
    sourcemap: true
  },
  server: {
    port: 8080,
    host: '0.0.0.0'
  }
})
