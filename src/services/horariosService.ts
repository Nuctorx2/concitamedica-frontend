import apiClient from './apiClient'

// DTOs
export interface HorarioDTO {
  diaSemana: string // "LUNES", "MARTES"...
  horaInicio: string // "08:00:00"
  horaFin: string // "17:00:00"
}

export interface HorarioResponse {
  id: number
  diaSemana: string
  horaInicio: string
  horaFin: string
}

const horariosService = {
  // Obtener
  async getByMedico(medicoId: number): Promise<HorarioResponse[]> {
    const res = await apiClient.get<HorarioResponse[]>(`/admin/medicos/${medicoId}/horarios`)
    return res.data
  },

  // Reemplazar Todo (PUT)
  async saveAll(medicoId: number, horarios: HorarioDTO[]): Promise<HorarioResponse[]> {
    const res = await apiClient.put<HorarioResponse[]>(
      `/admin/medicos/${medicoId}/horarios`,
      horarios,
    )
    return res.data
  },
}

export default horariosService
