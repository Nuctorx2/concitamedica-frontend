// src/services/usuariosService.ts
// Servicio para manejar usuarios en ConCitaMedica
// - CRUD completo (listar, obtener, crear, editar, eliminar)
// - Usa apiClient con token automático
// - Comentarios sencillos estilo estudiante de 1er semestre

import apiClient from './apiClient'

// Tipo base de usuario (ajústalo según tu backend)
export interface Usuario {
  id: number
  username: string
  email: string
  role: string
  estado?: string // opcional, depende de tu backend
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
  /**
   * getAll()
   * - Trae la lista completa de usuarios
   * - GET /usuarios
   */
  async getAll(): Promise<Usuario[]> {
    const res = await apiClient.get<Usuario[]>('/usuarios')
    return res.data
  },

  /**
   * getById(id)
   * - Trae un usuario por ID
   * - GET /usuarios/{id}
   */
  async getById(id: number): Promise<Usuario> {
    const res = await apiClient.get<Usuario>(`/usuarios/${id}`)
    return res.data
  },

  /**
   * create(data)
   * - Crea un usuario
   * - POST /usuarios
   */
  async create(data: UsuarioCreateRequest): Promise<Usuario> {
    const res = await apiClient.post<Usuario>('/usuarios', data)
    return res.data
  },

  /**
   * update(id, data)
   * - Actualiza campos del usuario
   * - PUT /usuarios/{id}
   */
  async update(id: number, data: UsuarioUpdateRequest): Promise<Usuario> {
    const res = await apiClient.put<Usuario>(`/usuarios/${id}`, data)
    return res.data
  },

  /**
   * delete(id)
   * - Elimina usuario por ID
   * - DELETE /usuarios/{id}
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`)
  },
}

export default usuariosService
