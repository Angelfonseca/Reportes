import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Esto permite que el servidor sea accesible desde la red local
    port: 5173  // Puedes cambiar el puerto si lo deseas
  }
})
