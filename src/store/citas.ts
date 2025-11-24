import { defineStore } from 'pinia'
import citasService, { type CitaResponse } from '@/services/citasService'

export const useCitasStore = defineStore('citas', {
  state: () => ({
    misCitas: [] as CitaResponse[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMisCitas() {
      this.loading = true
      try {
        const data = await citasService.getMisCitas()
        this.misCitas = data
      } catch (err) {
        console.error(err)
        this.error = 'Error cargando tus citas'
      } finally {
        this.loading = false
      }
    },

    // Acción simple para agendar y recargar la lista
    async agendarNuevaCita(medicoId: number, fechaHora: string) {
      this.loading = true
      try {
        await citasService.agendarCita({ medicoId, fechaHoraInicio: fechaHora })
        // Recargar la lista después de agendar
        await this.fetchMisCitas()
        return true
      } catch (err: any) {
        throw err // Lanzamos el error para que la vista lo maneje (mostrar alerta)
      } finally {
        this.loading = false
      }
    },

    // 🆕 Acción Admin
    async fetchTodasLasCitas() {
      this.loading = true
      try {
        const data = await citasService.getAllCitasAdmin()
        this.misCitas = data // Reutilizamos el estado 'misCitas' o creamos uno nuevo 'todasCitas'
      } catch (e) {
        this.error = 'Error al cargar reporte de citas'
      } finally {
        this.loading = false
      }
    },

    async cancelarCitaAdmin(id: number) {
      try {
        await citasService.cancelarCita(id)
        // Actualizar localmente
        const cita = this.misCitas.find((c) => c.id === id)
        if (cita) cita.estado = 'CANCELADA'
      } catch (e) {
        alert('Error al cancelar la cita')
      }
    },
  },
})
