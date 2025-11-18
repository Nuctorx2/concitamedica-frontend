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
    // Un getter útil para saber cuántos tenemos
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
        this.error = 'No se pudieron cargar los pacientes.'
      } finally {
        this.loading = false
      }
    },

    async crearPaciente(datos: PacienteCreateRequest) {
      this.loading = true
      this.error = null
      try {
        const nuevo = await pacientesService.create(datos)
        // Optimistic UI: Lo agregamos a la lista local inmediatamente
        this.pacientes.push(nuevo)
        return true
      } catch (err: any) {
        console.error('Error creando paciente:', err)
        this.error = 'Error al guardar el paciente.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async eliminarPaciente(id: number) {
      // Confirmación básica (aunque idealmente se hace en la vista)
      this.loading = true
      try {
        await pacientesService.delete(id)
        // Actualizar la lista local filtrando el eliminado
        this.pacientes = this.pacientes.filter((p) => p.id !== id)
      } catch (err: any) {
        console.error('Error eliminando:', err)
        this.error = 'No se pudo eliminar el paciente.'
      } finally {
        this.loading = false
      }
    },

    //Acción para cargar UN paciente (al entrar a editar)
    async fetchPacienteById(id: number) {
      this.loading = true
      this.error = null
      this.pacienteActual = null
      try {
        // Nota: Asegúrate que pacientesService.getById apunte a /admin/pacientes/{id}
        const data = await pacientesService.getById(id)
        this.pacienteActual = data
      } catch (err: any) {
        console.error('Error cargando paciente:', err)
        this.error = 'No se pudo cargar la información del paciente.'
      } finally {
        this.loading = false
      }
    },

    //Acción para actualizar
    async actualizarPaciente(id: number, datos: PacienteUpdateRequest) {
      this.loading = true
      try {
        const actualizado = await pacientesService.update(id, datos)

        // Actualizar la lista local para reflejar cambios sin recargar
        const index = this.pacientes.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.pacientes[index] = actualizado
        }
        return true
      } catch (err: any) {
        console.error('Error actualizando:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
