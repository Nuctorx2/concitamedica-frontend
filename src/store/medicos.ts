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
      } finally {
        this.loading = false
      }
    },

    async crearMedico(datos: MedicoCreateRequest) {
      this.loading = true
      this.error = null
      try {
        await medicosService.create(datos)
        await this.fetchMedicos() // Recargar lista
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
        // Actualización optimista: lo quitamos de la lista local
        this.medicos = this.medicos.filter((m) => m.id !== id)
      } catch (e) {
        this.error = 'Error al eliminar médico'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    // 🆕 Cargar datos para edición
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

    // 🆕 Guardar cambios
    async actualizarMedico(id: number, datos: MedicoUpdateRequest) {
      this.loading = true
      try {
        await medicosService.update(id, datos)
        // Actualizar lista local (Optimistic UI)
        // O simplemente forzar recarga en la vista de lista
      } catch (e: any) {
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
