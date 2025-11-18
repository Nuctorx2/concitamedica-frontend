import apiClient from './apiClient'

export interface Especialidad {
  id: number
  nombre: string
  descripcion?: string
}

const especialidadesService = {
  async getAll(): Promise<Especialidad[]> {
    // Endpoint que creamos al principio: /api/especialidades
    const res = await apiClient.get<Especialidad[]>('/especialidades')
    return res.data
  },
}

export default especialidadesService
