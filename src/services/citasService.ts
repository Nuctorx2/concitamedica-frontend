import apiClient from './apiClient'

export interface DisponibilidadSlot {
  horaInicio: string
}

export interface AgendarCitaRequest {
  medicoId: number
  fechaHoraInicio: string
}

// src/services/citasService.ts
export interface CitaResponse {
  id: number
  medicoId: number
  pacienteId: number
  nombreMedico: string
  nombrePaciente: string
  especialidad: string
  fechaHoraInicio: string
  estado: string
}

export interface CitaMedicoResponse {
  citaId: number
  nombrePaciente: string
  fechaHoraInicio: string
  fechaHoraFin: string
  estado: string
}

const citasService = {
  async getDisponibilidad(medicoId: number, fecha: string): Promise<DisponibilidadSlot[]> {
    const res = await apiClient.get<DisponibilidadSlot[]>(
      `/pacientes/medicos/${medicoId}/disponibilidad`,
      { params: { fecha } },
    )
    return res.data
  },

  async agendarCita(payload: AgendarCitaRequest): Promise<CitaResponse> {
    const res = await apiClient.post<CitaResponse>('/pacientes/citas', payload)
    return res.data
  },

  async getMisCitas(): Promise<CitaResponse[]> {
    const res = await apiClient.get<CitaResponse[]>('/pacientes/citas/proximas')
    return res.data
  },

  async getAgendaMedico(fecha: string): Promise<CitaMedicoResponse[]> {
    const res = await apiClient.get<CitaMedicoResponse[]>('/medicos/agenda/dia', {
      params: { fecha },
    })
    return res.data
  },

  async getAllCitasAdmin(): Promise<CitaResponse[]> {
    const res = await apiClient.get<CitaResponse[]>('/admin/citas')
    return res.data
  },

  async cancelarCita(id: number): Promise<void> {
    await apiClient.put(`/admin/citas/${id}/cancelar`)
  },
}

export default citasService
