import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/store/auth'

const BASE_URL = '/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// --- Helpers de Token ---

function getTokenFromStore(): string | null {
  try {
    const authStore = useAuthStore()
    if (authStore?.accessToken) return authStore.accessToken
  } catch (e) {}
  const token = localStorage.getItem('ccm_access_token')
  return token ? token.trim() : null
}

export function setAccessToken(token: string) {
  const cleanToken = token.trim()
  localStorage.setItem('ccm_access_token', cleanToken)
  try {
    const authStore = useAuthStore()
    authStore.setAccessToken(cleanToken)
  } catch (e) {}
}

export function clearAccessToken() {
  localStorage.removeItem('ccm_access_token')
  try {
    const authStore = useAuthStore()
    authStore.logout()
  } catch (e) {}
}

// --- Interceptores ---

// 1. REQUEST: Inyectar Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromStore()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config as InternalAxiosRequestConfig
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // CASO ESPECIAL: Error en descarga de archivos (Blob)
    // Si pedimos un PDF (blob) pero el servidor devuelve un JSON de error (ej. 403),
    // Axios lo envuelve en un Blob. Hay que leerlo para mostrar el mensaje real.
    if (error.response?.data instanceof Blob && error.response.data.type === 'application/json') {
      try {
        const errorText = await (error.response.data as Blob).text()
        error.response.data = JSON.parse(errorText) // Reemplazamos el blob por el JSON real
      } catch (e) {
        console.error('Error parseando blob de error', e)
      }
    }

    const status = error.response?.status

    // CASO 401: Token Expirado o Inválido
    if (status === 401) {
      console.warn('Sesión expirada o inválida. Redirigiendo al login.')
      clearAccessToken() // Limpieza completa
      router.replace({ name: 'login' }).catch(() => {
        /* noop */
      })
    }

    // CASO 403: Acceso Denegado (Aunque estemos logueados)
    if (status === 403) {
      console.error('Acceso denegado a este recurso.')
    }

    return Promise.reject(error)
  },
)

export default apiClient
