import apiClient from './apiClient'

export interface MedicoDTO {
  id: number
  nombre: string
  email: string
  especialidadNombre: string
}

const medicosService = {
  // Buscar médicos por ID de especialidad
  async buscarPorEspecialidad(especialidadId: number): Promise<MedicoDTO[]> {
    // Endpoint: /api/medicos/buscar?especialidadId=X
    const res = await apiClient.get<MedicoDTO[]>('/medicos/buscar', {
      params: { especialidadId },
    })
    return res.data
  },
}

export default medicosService
