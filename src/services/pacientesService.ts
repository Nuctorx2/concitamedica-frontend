import apiClient from './apiClient'
export interface Paciente {
  id: number
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  email?: string
  fechaNacimiento: string
  genero: string
  activo: boolean
}

export interface PacienteCreateRequest {
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  email?: string
  fechaNacimiento: string
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
  fechaNacimiento: string
  genero: string
}

const pacientesService = {
  async getAll(): Promise<Paciente[]> {
    const res = await apiClient.get<Paciente[]>('/admin/pacientes')
    return res.data
  },

  async create(data: PacienteCreateRequest): Promise<Paciente> {
    const res = await apiClient.post<Paciente>('/admin/pacientes', data)
    return res.data
  },
  async getById(id: number): Promise<Paciente> {
    const res = await apiClient.get<Paciente>(`/admin/pacientes/${id}`)
    return res.data
  },

  async update(id: number, data: PacienteUpdateRequest): Promise<Paciente> {
    const res = await apiClient.put<Paciente>(`/admin/pacientes/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/pacientes/${id}`)
  },

  async reactivate(id: number): Promise<void> {
    await apiClient.put(`/admin/pacientes/${id}/reactivar`)
  },
}

export default pacientesService
