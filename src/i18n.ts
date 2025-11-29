import { createI18n } from 'vue-i18n'

import es from '@/locales/es.json'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'
import it from '@/locales/it.json'

const savedLocale = localStorage.getItem('user-locale')
const browserLocale = navigator.language.split('-')[0]
const defaultLocale =
  savedLocale || (['es', 'en', 'pt', 'it'].includes(browserLocale) ? browserLocale : 'es')

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'es',
  globalInjection: true,
  messages: {
    es,
    en,
    pt,
    it,
  },
})

export default i18n
