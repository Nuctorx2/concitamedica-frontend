import apiClient from './apiClient'

// DTOs para el proceso
export interface DisponibilidadSlot {
  horaInicio: string // Formato "HH:mm:ss" o "HH:mm"
}

export interface AgendarCitaRequest {
  medicoId: number
  fechaHoraInicio: string // Formato ISO LocalDateTime "YYYY-MM-DDTHH:mm:ss"
}

export interface CitaResponse {
  id: number
  medicoId: number
  nombreMedico: string
  fechaHoraInicio: string
  estado: string
}

const citasService = {
  // 1. Obtener slots disponibles (La lógica compleja del backend)
  async getDisponibilidad(medicoId: number, fecha: string): Promise<DisponibilidadSlot[]> {
    // Endpoint: /api/pacientes/medicos/{id}/disponibilidad?fecha=YYYY-MM-DD
    const res = await apiClient.get<DisponibilidadSlot[]>(
      `/pacientes/medicos/${medicoId}/disponibilidad`,
      { params: { fecha } },
    )
    return res.data
  },

  // 2. Agendar la cita
  async agendarCita(payload: AgendarCitaRequest): Promise<CitaResponse> {
    // Endpoint: /api/pacientes/citas
    const res = await apiClient.post<CitaResponse>('/pacientes/citas', payload)
    return res.data
  },

  // 3. Obtener mis próximas citas
  async getMisCitas(): Promise<CitaResponse[]> {
    const res = await apiClient.get<CitaResponse[]>('/pacientes/citas/proximas')
    return res.data
  },
}

export default citasService
