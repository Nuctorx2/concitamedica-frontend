import apiClient, { setAccessToken, clearAccessToken } from './apiClient'
import type { User } from '@/store/auth'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombre: string
  apellido: string
  documento: string
  fechaNacimiento: string
  genero: string
  telefono: string
  direccion: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface ProfileUpdateRequest {
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  fechaNacimiento: string
  genero: string
}

export interface ChangePasswordRequest {
  passwordActual: string
  nuevaPassword: string
}

const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', payload)
    return res.data
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me')
    return res.data
  },

  async register(payload: RegisterRequest): Promise<any> {
    const res = await apiClient.post('/auth/register', payload)
    return res.data
  },

  logout() {
    clearAccessToken()
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const res = await apiClient.put<User>('/auth/perfil', data)
    return res.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.put('/auth/cambiar-password', data)
  },
}

export default authService
