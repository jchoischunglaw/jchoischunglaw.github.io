import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/heliaer/',
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 4000       // Try port 4000, but allow fallback to other ports
  }
})
