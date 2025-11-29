import apiClient from './apiClient'

export interface Medico {
  id: number
  nombre: string
  apellido: string
  email: string
  documento: string
  telefono: string
  direccion: string
  fechaNacimiento: string
  genero: string
  especialidadNombre: string
  especialidadId: number
  activo: boolean
}

export interface MedicoCreateRequest {
  nombre: string
  apellido: string
  documento: string
  email: string
  password: string
  telefono: string
  direccion: string
  fechaNacimiento: string
  genero: string
  especialidadId: number
}

export interface MedicoUpdateRequest {
  nombre: string
  apellido: string
  documento: string
  telefono: string
  direccion: string
  fechaNacimiento: string
  genero: string
  especialidadId: number
}

const medicosService = {
  // Listar todos (Admin)
  async getAll(): Promise<Medico[]> {
    const res = await apiClient.get<Medico[]>('/admin/medicos')
    return res.data
  },

  // Crear (Admin)
  async create(data: MedicoCreateRequest): Promise<Medico> {
    const res = await apiClient.post<Medico>('/admin/medicos', data)
    return res.data
  },

  // Buscar por especialidad (Público/Paciente)
  async buscarPorEspecialidad(especialidadId: number): Promise<Medico[]> {
    const res = await apiClient.get<Medico[]>('/medicos/buscar', {
      params: { especialidadId },
    })
    return res.data
  },

  // Eliminar (Admin)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/medicos/${id}`)
  },

  // Obtener por ID (Admin)
  async getById(id: number): Promise<Medico> {
    const res = await apiClient.get<Medico>(`/admin/medicos/${id}`)
    return res.data
  },

  // Actualizar (Admin)
  async update(id: number, data: MedicoUpdateRequest): Promise<Medico> {
    const res = await apiClient.put<Medico>(`/admin/medicos/${id}`, data)
    return res.data
  },

  //Reactivar médico (Admin)
  async reactivate(id: number): Promise<void> {
    await apiClient.put(`/admin/medicos/${id}/reactivar`)
  },
}

export default medicosService
