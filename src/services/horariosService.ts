import apiClient from './apiClient'

export interface HorarioDTO {
  diaSemana: string
  horaInicio: string
  horaFin: string
}

export interface HorarioResponse {
  id: number
  diaSemana: string
  horaInicio: string
  horaFin: string
}

const horariosService = {
  async getByMedico(medicoId: number): Promise<HorarioResponse[]> {
    const res = await apiClient.get<HorarioResponse[]>(`/admin/medicos/${medicoId}/horarios`)
    return res.data
  },

  async saveAll(medicoId: number, horarios: HorarioDTO[]): Promise<HorarioResponse[]> {
    const res = await apiClient.put<HorarioResponse[]>(
      `/admin/medicos/${medicoId}/horarios`,
      horarios,
    )
    return res.data
  },
}

export default horariosService
