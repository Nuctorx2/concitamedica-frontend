// src/services/pacientesService.ts
// Servicio para manejar pacientes en ConCitaMedica
// - CRUD completo
// - Usa apiClient (envía automáticamente Authorization si existe token)
// - Comentarios estilo estudiante de 1er semestre para dejar claro qué hace cada parte

import apiClient from './apiClient'

// Interfaz base del paciente según lo que normalmente se usa en un sistema médico
// Ajusta los campos según tu backend real.
export interface Paciente {
  id: number
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  email?: string
  fechaNacimiento: string // Spring Boot lo envía como "YYYY-MM-DD"
  genero: string
}

export interface PacienteCreateRequest {
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  email?: string
  fechaNacimiento: string //Formato YYYY-MM-DD
  genero: string
  password?: string
}

export interface PacienteUpdateRequest {
  nombre?: string
  apellido?: string
  documento?: string
  telefono?: string
  direccion?: string
  email?: string
  fechaNacimiento: string // Spring Boot lo envía como "YYYY-MM-DD"
  genero: string
}

const pacientesService = {
  /**
   * getAll()
   * - Trae la lista completa de pacientes
   * - GET /pacientes
   */
  async getAll(): Promise<Paciente[]> {
    const res = await apiClient.get<Paciente[]>('/admin/pacientes')
    return res.data
  },

  async create(data: PacienteCreateRequest): Promise<Paciente> {
    const res = await apiClient.post<Paciente>('/admin/pacientes', data)
    return res.data
  },
  /**
   * getById(id)
   * - Obtiene un paciente específico
   * - GET /pacientes/{id}
   */
  async getById(id: number): Promise<Paciente> {
    const res = await apiClient.get<Paciente>(`/admin/pacientes/${id}`)
    return res.data
  },

  /**
   * update(id, data)
   * - Actualiza un paciente existente
   * - PUT /pacientes/{id}
   */
  async update(id: number, data: PacienteUpdateRequest): Promise<Paciente> {
    const res = await apiClient.put<Paciente>(`/admin/pacientes/${id}`, data)
    return res.data
  },

  /**
   * delete(id)
   * - Elimina un paciente por ID
   * - DELETE /pacientes/{id}
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/pacientes/${id}`)
  },
}

export default pacientesService
