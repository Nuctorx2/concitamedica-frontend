import { defineStore } from 'pinia'
import router from '@/router'
import authService, { type LoginRequest, ProfileUpdateRequest } from '@/services/authService'

export interface User {
  id: number
  nombre: string
  email: string
  rol: string
  apellido?: string
  documento?: string
  telefono?: string
  direccion?: string
  fechaNacimiento?: string
  genero?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.rol === 'ROLE_ADMIN',
    isPaciente: (state) => state.user?.rol === 'ROLE_PACIENTE',
    isMedico: (state) => state.user?.rol === 'ROLE_MEDICO',
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        const response = await authService.login(credentials)
        this.setAccessToken(response.token)

        const user = await authService.getMe()
        this.setUser(user)

        router.push({ name: 'dashboard' })
      } catch (error) {
        console.error('Error en login:', error)
        throw error
      }
    },

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
          this.logout()
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
      localStorage.setItem('ccm_user', JSON.stringify(user))
    },

    logout() {
      this.accessToken = null
      this.user = null
      localStorage.removeItem('ccm_access_token')
      localStorage.removeItem('ccm_user')
      router.push({ name: 'login' })
    },

    async actualizarPerfil(datos: ProfileUpdateRequest) {
      try {
        const usuarioActualizado = await authService.updateProfile(datos)
        this.setUser(usuarioActualizado)
        return true
      } catch (e) {
        throw e
      }
    },

    async cambiarPassword(actual: string, nueva: string) {
      try {
        await authService.changePassword({ passwordActual: actual, nuevaPassword: nueva })
        return true
      } catch (e) {
        throw e
      }
    },
  },
})
