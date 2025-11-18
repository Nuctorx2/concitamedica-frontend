import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
// 👇 1. IMPORTAMOS LA CONFIGURACIÓN DE TYPESCRIPT
import vueTs from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'], // 👈 2. AGREGAMOS ts y tsx AQUÍ
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // 👇 3. AGREGAMOS LAS REGLAS DE TYPESCRIPT AQUÍ
  ...vueTs.configs.recommended,

  skipFormatting,
])
