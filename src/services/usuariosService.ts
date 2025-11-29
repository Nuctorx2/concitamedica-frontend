import apiClient from './apiClient'
export interface Usuario {
  id: number
  username: string
  email: string
  role: string
  estado?: string
}

export interface UsuarioCreateRequest {
  username: string
  email: string
  password: string
  role: string
}

export interface UsuarioUpdateRequest {
  username?: string
  email?: string
  password?: string
  role?: string
  estado?: string
}

const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const res = await apiClient.get<Usuario[]>('/usuarios')
    return res.data
  },

  async getById(id: number): Promise<Usuario> {
    const res = await apiClient.get<Usuario>(`/usuarios/${id}`)
    return res.data
  },

  async create(data: UsuarioCreateRequest): Promise<Usuario> {
    const res = await apiClient.post<Usuario>('/usuarios', data)
    return res.data
  },

  async update(id: number, data: UsuarioUpdateRequest): Promise<Usuario> {
    const res = await apiClient.put<Usuario>(`/usuarios/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`)
  },
}

export default usuariosService
