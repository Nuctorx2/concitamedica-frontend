// src/store/auth.ts
import { defineStore } from 'pinia'
import router from '@/router'
import authService, { type LoginRequest } from '@/services/authService'

// 👇 CORRECCIÓN 1: Usamos 'rol' (como en Java) y no 'role'.
export interface User {
  id: number
  nombre: string
  email: string
  rol: string // Debe coincidir con UsuarioResponseDTO del backend
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    // Helper para verificar roles fácilmente en las vistas
    isAdmin: (state) => state.user?.rol === 'ROLE_ADMIN',
    isPaciente: (state) => state.user?.rol === 'ROLE_PACIENTE',
    isMedico: (state) => state.user?.rol === 'ROLE_MEDICO',
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        // 1. Login para obtener token
        const response = await authService.login(credentials)
        this.setAccessToken(response.token)

        // 2. Usar el token para obtener datos del usuario
        const user = await authService.getMe()
        this.setUser(user)

        // 3. Redirigir al dashboard
        router.push({ name: 'dashboard' }) // Asegúrate que en router se llame 'dashboard'
      } catch (error) {
        console.error('Error en login:', error)
        throw error
      }
    },

    // 👇 CORRECCIÓN 2: Esta función es la cura para la amnesia
    initializeFromStorage() {
      const rawToken = localStorage.getItem('ccm_access_token')
      const rawUser = localStorage.getItem('ccm_user')

      if (rawToken) {
        this.accessToken = rawToken
      }

      if (rawUser) {
        try {
          this.user = JSON.parse(rawUser)
        } catch (e) {
          console.error('Error recuperando usuario de storage')
          this.logout() // Si está corrupto, mejor limpiar
        }
      }
      this.initialized = true
    },

    setAccessToken(token: string) {
      this.accessToken = token
      localStorage.setItem('ccm_access_token', token)
    },

    setUser(user: User) {
      this.user = user
      // Guardamos el objeto usuario completo
      localStorage.setItem('ccm_user', JSON.stringify(user))
    },

    logout() {
      this.accessToken = null
      this.user = null
      localStorage.removeItem('ccm_access_token')
      localStorage.removeItem('ccm_user')
      router.push({ name: 'login' }) // Usar push en vez de replace suele ser más seguro aquí
    },
  },
})
