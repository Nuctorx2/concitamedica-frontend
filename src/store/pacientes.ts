import { defineStore } from 'pinia'
import pacientesService, {
  type Paciente,
  type PacienteCreateRequest,
  type PacienteUpdateRequest,
} from '@/services/pacientesService'

export const usePacientesStore = defineStore('pacientes', {
  state: () => ({
    pacientes: [] as Paciente[],
    pacienteActual: null as Paciente | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalPacientes: (state) => state.pacientes.length,
  },

  actions: {
    async fetchPacientes() {
      this.loading = true
      this.error = null
      try {
        const data = await pacientesService.getAll()
        this.pacientes = data
      } catch (err: any) {
        console.error('Error cargando pacientes:', err)
        this.error = err.response?.data?.message || 'No se pudieron cargar los pacientes.'
      } finally {
        this.loading = false
      }
    },

    async crearPaciente(datos: PacienteCreateRequest) {
      this.loading = true
      this.error = null
      try {
        const nuevo = await pacientesService.create(datos)
        this.pacientes.push(nuevo)
        return true
      } catch (err: any) {
        console.error('Error creando paciente:', err)
        this.error = err.response?.data?.message || 'Error al crear el paciente.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async eliminarPaciente(id: number) {
      this.loading = true
      this.error = null
      try {
        await pacientesService.delete(id)

        const p = this.pacientes.find((x) => x.id === id)
        if (p) p.activo = false
      } catch (err: any) {
        console.error('Error eliminando paciente:', err)
        this.error =
          err.response?.data?.message || 'Ocurrió un error al intentar inactivar el paciente.'
      } finally {
        this.loading = false
      }
    },

    async fetchPacienteById(id: number) {
      this.loading = true
      this.error = null
      this.pacienteActual = null
      try {
        const data = await pacientesService.getById(id)
        this.pacienteActual = data
      } catch (err: any) {
        console.error('Error cargando paciente:', err)
        this.error = err.response?.data?.message || 'No se pudo cargar el paciente.'
      } finally {
        this.loading = false
      }
    },

    async actualizarPaciente(id: number, datos: PacienteUpdateRequest) {
      this.loading = true
      this.error = null
      try {
        const actualizado = await pacientesService.update(id, datos)
        const index = this.pacientes.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.pacientes[index] = actualizado
        }
        return true
      } catch (err: any) {
        console.error('Error actualizando:', err)
        this.error = err.response?.data?.message || 'Error al actualizar el paciente.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async reactivarPaciente(id: number) {
      this.loading = true
      this.error = null
      try {
        await pacientesService.reactivate(id)
        const p = this.pacientes.find((x) => x.id === id)
        if (p) p.activo = true
      } catch (err: any) {
        console.error('Error reactivando paciente:', err)
        this.error =
          err.response?.data?.message || 'Ocurrió un error al intentar reactivar el paciente.'
      } finally {
        this.loading = false
      }
    },
  },
})
