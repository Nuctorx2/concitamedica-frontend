import { defineStore } from 'pinia'
import horariosService, { type HorarioResponse, type HorarioDTO } from '@/services/horariosService'

export const useHorariosStore = defineStore('horarios', {
  state: () => ({
    horarios: [] as HorarioResponse[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchHorarios(medicoId: number) {
      this.loading = true
      this.error = null
      try {
        this.horarios = await horariosService.getByMedico(medicoId)
      } catch (e) {
        this.error = 'Error al cargar horarios'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async guardarHorarios(medicoId: number, lista: HorarioDTO[]) {
      this.loading = true
      this.error = null
      try {
        const nuevos = await horariosService.saveAll(medicoId, lista)
        this.horarios = nuevos
        return true
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Error al guardar horarios'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
