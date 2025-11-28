import { createI18n } from 'vue-i18n'

// Importamos los JSONs directamente
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'
import it from '@/locales/it.json'

// Detectar idioma del navegador o usar guardado
const savedLocale = localStorage.getItem('user-locale')
const browserLocale = navigator.language.split('-')[0]
const defaultLocale =
  savedLocale || (['es', 'en', 'pt', 'it'].includes(browserLocale) ? browserLocale : 'es')

const i18n = createI18n({
  legacy: false, // Importante para Vue 3 Composition API
  locale: defaultLocale,
  fallbackLocale: 'es',
  globalInjection: true, // Permite usar $t en templates
  messages: {
    es,
    en,
    pt,
    it,
  },
})

export default i18n
