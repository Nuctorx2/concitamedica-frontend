import apiClient, { setAccessToken, clearAccessToken } from './apiClient'
import type { User } from '@/store/auth' // Importamos el tipo User del store

export interface LoginRequest {
  email: string // OJO: Tu backend espera "email", no "username"
  password: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  password: string
  fechaNacimiento: string
  genero: string
  rol: string // Recuerda: el backend lo forzará a PACIENTE si es público
}

// Respuesta del login (según tu DTO de Java)
export interface LoginResponse {
  token: string
}

const authService = {
  /**
   * Paso 1: Obtener el token
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Nota: Cambié '/auth/login' por payload que usa email
    const res = await apiClient.post<LoginResponse>('/auth/login', payload)
    return res.data
  },

  /**
   * Paso 2: Obtener datos del usuario (Endpoint /me)
   * Esto se llama justo después del login
   */
  async getMe(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me')
    return res.data
  },

  /**
   * Registro: En tu backend devuelve el Usuario creado (Status 201), no el token.
   * El flujo será: Registrar -> Redirigir a Login
   */
  async register(payload: RegisterRequest): Promise<any> {
    const res = await apiClient.post('/auth/register', payload)
    return res.data
  },

  logout() {
    clearAccessToken()
  },
}

export default authService
