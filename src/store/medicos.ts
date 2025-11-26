import { defineStore } from 'pinia'
import medicosService, {
  type Medico,
  type MedicoCreateRequest,
  type MedicoUpdateRequest,
} from '@/services/medicosService'

export const useMedicosStore = defineStore('medicos', {
  state: () => ({
    medicos: [] as Medico[],
    medicoActual: null as Medico | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMedicos() {
      this.loading = true
      this.error = null
      try {
        this.medicos = await medicosService.getAll()
      } catch (e) {
        this.error = 'Error al cargar médicos'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async crearMedico(datos: MedicoCreateRequest) {
      this.loading = true
      this.error = null
      try {
        await medicosService.create(datos)
        await this.fetchMedicos()
        return true
      } catch (e: any) {
        throw e
      } finally {
        this.loading = false
      }
    },

    async eliminarMedico(id: number) {
      this.loading = true
      try {
        await medicosService.delete(id)
        // Actualizamos la lista localmente:
        // Buscamos el médico y lo marcamos como inactivo (Soft Delete)
        const medico = this.medicos.find((m) => m.id === id)
        if (medico) medico.activo = false
      } catch (e) {
        this.error = 'Error al eliminar médico'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async fetchMedicoById(id: number) {
      this.loading = true
      this.medicoActual = null
      try {
        this.medicoActual = await medicosService.getById(id)
      } catch (e) {
        this.error = 'Error al cargar datos del médico'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async actualizarMedico(id: number, datos: MedicoUpdateRequest) {
      this.loading = true
      try {
        await medicosService.update(id, datos)
        // Podríamos recargar la lista completa o actualizar solo este item
        await this.fetchMedicos()
      } catch (e: any) {
        throw e
      } finally {
        this.loading = false
      }
    },

    async reactivarMedico(id: number) {
      this.loading = true
      try {
        await medicosService.reactivate(id)
        // Actualizamos la lista localmente
        const medico = this.medicos.find((m) => m.id === id)
        if (medico) medico.activo = true
      } catch (e) {
        console.error(e)
        this.error = 'Error al reactivar médico'
      } finally {
        this.loading = false
      }
    },
  },
})
