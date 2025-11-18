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
  },
})
