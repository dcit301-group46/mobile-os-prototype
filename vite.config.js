import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@system': '/src/system',
      '@services': '/src/services',
      '@ui': '/src/ui',
      '@apps': '/src/apps',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils'
    }
  }
})
