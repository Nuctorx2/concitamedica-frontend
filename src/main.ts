import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/store/auth'

// Importa tus estilos aquí (asegúrate de que el archivo exista)
// import '@/assets/scss/main.scss'
import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap.min.css' // Asegúrate de tener bootstrap instalado
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Recuperar sesión antes de montar
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.mount('#app')
