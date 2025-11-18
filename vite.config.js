import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 👇 ESTA ES LA PARTE QUE TE FALTA PARA CONECTAR CON SPRING BOOT
  server: {
    port: 5173, // Puerto del frontend
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 👈 Apuntamos al Backend Java
        changeOrigin: true,
        secure: false,
        // Como tu backend YA tiene /api en el Controller (@RequestMapping("/api/auth")),
        // NO necesitamos reescribir la ruta. Se envía tal cual.
      },
    },
  },
})
