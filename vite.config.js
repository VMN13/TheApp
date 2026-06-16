import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://serverusers-87tl.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
