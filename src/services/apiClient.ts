// src/services/apiClient.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
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

function getTokenFromStore(): string | null {
  try {
    const authStore = useAuthStore()
    if (authStore?.accessToken) return authStore.accessToken
  } catch (e) {
    // Fallback: Pinia aún no está inicializado.
  }

  const token = localStorage.getItem('ccm_access_token')
  // ✅ CORRECCIÓN 1: Sintaxis y limpieza del token
  return token ? token.trim() : null
}

/**
 * request interceptor
 * - añade Authorization si existe token
 */
apiClient.interceptors.request.use(
  // ✅ CORRECCIÓN 2: Tipado implícito
  (config) => {
    const token = getTokenFromStore()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config as InternalAxiosRequestConfig // Aseguramos el tipo de retorno
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * response interceptor
 * - detecta 401 Unauthorized y fuerza logout + redirect a /login
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    // Si recibimos 401 significa que el token es inválido/expiró
    if (status === 401) {
      try {
        const authStore = useAuthStore()
        authStore.logout() // 👈 Llama a la acción de limpieza completa
      } catch (e) {
        localStorage.removeItem('ccm_access_token')
      }

      router.replace({ name: 'login' }).catch(() => {
        /* noop */
      })
    }

    return Promise.reject(error)
  },
)

// Helper methods (expuestos)

export function setAccessToken(token: string) {
  localStorage.setItem('ccm_access_token', token.trim()) // 👈 También limpiamos al guardar
  try {
    const authStore = useAuthStore()
    authStore.setAccessToken(token.trim())
  } catch (e) {
    // ignore
  }
}

export function clearAccessToken() {
  localStorage.removeItem('ccm_access_token')
  try {
    const authStore = useAuthStore()
    // ✅ CORRECCIÓN 3: La acción correcta es 'logout' o llamar al clear dentro del store.
    authStore.logout()
  } catch (e) {
    // ignore
  }
}

export default apiClient
