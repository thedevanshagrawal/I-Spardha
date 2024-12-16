import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users': 'http://localhost:5000/api/v1',
    }
  },
  plugins: [react()],
})
