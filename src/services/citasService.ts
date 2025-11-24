import apiClient from './apiClient'

// DTOs para el proceso
export interface DisponibilidadSlot {
  horaInicio: string // Formato "HH:mm:ss" o "HH:mm"
}

export interface AgendarCitaRequest {
  medicoId: number
  fechaHoraInicio: string // Formato ISO LocalDateTime "YYYY-MM-DDTHH:mm:ss"
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
  // Obtener slots disponibles (La lógica compleja del backend)
  async getDisponibilidad(medicoId: number, fecha: string): Promise<DisponibilidadSlot[]> {
    // Endpoint: /api/pacientes/medicos/{id}/disponibilidad?fecha=YYYY-MM-DD
    const res = await apiClient.get<DisponibilidadSlot[]>(
      `/pacientes/medicos/${medicoId}/disponibilidad`,
      { params: { fecha } },
    )
    return res.data
  },

  // Agendar la cita
  async agendarCita(payload: AgendarCitaRequest): Promise<CitaResponse> {
    // Endpoint: /api/pacientes/citas
    const res = await apiClient.post<CitaResponse>('/pacientes/citas', payload)
    return res.data
  },

  // Obtener mis próximas citas
  async getMisCitas(): Promise<CitaResponse[]> {
    const res = await apiClient.get<CitaResponse[]>('/pacientes/citas/proximas')
    return res.data
  },

  async getAgendaMedico(fecha: string): Promise<CitaMedicoResponse[]> {
    // Endpoint: /api/medicos/agenda/dia?fecha=YYYY-MM-DD
    const res = await apiClient.get<CitaMedicoResponse[]>('/medicos/agenda/dia', {
      params: { fecha },
    })
    return res.data
  },

  //Admin: Listar todas
  async getAllCitasAdmin(): Promise<CitaResponse[]> {
    const res = await apiClient.get<CitaResponse[]>('/admin/citas')
    return res.data
  },

  //Admin: Cancelar
  async cancelarCita(id: number): Promise<void> {
    await apiClient.put(`/admin/citas/${id}/cancelar`)
  },
}

export default citasService
