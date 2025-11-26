<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark">Directorio Médico</h3>
        <p class="text-muted mb-0">Gestión de especialistas y profesionales.</p>
      </div>

      <RouterLink :to="{ name: 'medicos-create' }" class="btn btn-primary">
        <i class="mdi mdi-doctor me-1"></i> Nuevo Médico
      </RouterLink>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 text-muted">
                <i class="mdi mdi-magnify"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Buscar por Nombre, ID o Documento..."
                v-model="textoBusqueda"
              />
            </div>
          </div>

          <div class="col-md-3">
            <select class="form-select" v-model="especialidadFiltro">
              <option value="">Todas las Especialidades</option>
              <option v-for="esp in listaEspecialidades" :key="esp" :value="esp">
                {{ esp }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <div class="form-check form-switch ms-md-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="filterInactive"
                v-model="mostrarInactivos"
              />
              <label class="form-check-label small text-secondary" for="filterInactive">
                Mostrar Inactivos
              </label>
            </div>
          </div>

          <div class="col-md-2 text-end text-muted small">
            <strong>{{ medicosFiltrados.length }}</strong> resultados
          </div>
        </div>
      </div>
    </div>

    <div v-if="store.loading && store.medicos.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Cargando especialistas...</p>
    </div>

    <div v-else-if="store.error" class="alert alert-danger">
      {{ store.error }}
    </div>

    <div v-else class="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 text-uppercase text-secondary small">Médico</th>
                <th class="py-3 text-uppercase text-secondary small">Especialidad</th>
                <th class="py-3 text-uppercase text-secondary small">Contacto</th>
                <th class="py-3 text-uppercase text-secondary small">Estado</th>
                <th class="pe-4 py-3 text-end text-uppercase text-secondary small">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="medico in medicosFiltrados" :key="medico.id">
                <td class="ps-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-3 bg-white border text-primary">
                      <i class="mdi mdi-doctor"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ medico.nombre }} {{ medico.apellido }}</div>
                      <div class="small text-muted">ID: {{ medico.id }}</div>
                      <div
                        v-if="medico.documento"
                        class="small text-muted"
                        style="font-size: 0.75rem"
                      >
                        Doc: {{ medico.documento }}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    {{ medico.especialidadNombre }}
                  </span>
                </td>

                <td>
                  <div class="text-muted">{{ medico.email }}</div>
                  <div v-if="medico.telefono" class="small text-muted">{{ medico.telefono }}</div>
                </td>

                <td>
                  <span
                    class="badge rounded-pill border"
                    :class="
                      medico.activo
                        ? 'bg-success-subtle text-success border-success-subtle'
                        : 'bg-secondary-subtle text-secondary border-secondary-subtle'
                    "
                  >
                    {{ medico.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>

                <td class="pe-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <RouterLink
                      v-if="medico.activo"
                      :to="{ name: 'medicos-edit', params: { id: medico.id } }"
                      class="btn-icon btn-edit"
                      title="Editar"
                    >
                      <i class="mdi mdi-pencil-outline"></i>
                    </RouterLink>

                    <button
                      v-if="!medico.activo"
                      class="btn-icon btn-restore"
                      title="Reactivar Médico"
                      @click="reactivarMedico(medico.id)"
                    >
                      <i class="mdi mdi-refresh"></i>
                    </button>

                    <button
                      v-if="medico.activo"
                      class="btn-icon btn-delete"
                      title="Dar de baja"
                      @click="eliminarMedico(medico.id)"
                    >
                      <i class="mdi mdi-account-remove-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="medicosFiltrados.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <div class="mb-2">
                    <i class="mdi mdi-magnify fs-1 opacity-50"></i>
                  </div>
                  No se encontraron médicos que coincidan con los filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMedicosStore } from '@/store/medicos'

const store = useMedicosStore()

// Estados de los filtros
const mostrarInactivos = ref(false)
const textoBusqueda = ref('')
const especialidadFiltro = ref('')

onMounted(() => {
  store.fetchMedicos()
})

// 1. Extraer lista única de especialidades para llenar el <select>
const listaEspecialidades = computed(() => {
  const especialidades = store.medicos.map((m) => m.especialidadNombre)
  // Usamos Set para eliminar duplicados y luego convertimos a Array
  return Array.from(new Set(especialidades)).sort()
})

// 2. El Super Filtro Combinado
const medicosFiltrados = computed(() => {
  return store.medicos.filter((medico) => {
    // A. Filtro de Estado (Activo/Inactivo)
    const pasaEstado = mostrarInactivos.value ? true : medico.activo

    // B. Filtro de Texto (Nombre, Documento, ID)
    const texto = textoBusqueda.value.toLowerCase()
    const pasaTexto =
      medico.nombre.toLowerCase().includes(texto) ||
      (medico.documento && medico.documento.includes(texto)) || // Validamos que documento exista
      medico.id.toString().includes(texto)

    // C. Filtro de Especialidad
    const pasaEspecialidad = especialidadFiltro.value
      ? medico.especialidadNombre === especialidadFiltro.value
      : true

    // Tienen que cumplirse las 3 condiciones
    return pasaEstado && pasaTexto && pasaEspecialidad
  })
})

function eliminarMedico(id: number) {
  if (confirm('¿Estás seguro de dar de baja a este médico? Se cancelarán sus citas futuras.')) {
    store.eliminarMedico(id)
  }
}

function reactivarMedico(id: number) {
  if (
    confirm('¿Deseas reactivar a este médico? Podrá iniciar sesión y recibir citas nuevamente.')
  ) {
    store.reactivarMedico(id)
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &.btn-edit {
    color: #006655;
    &:hover {
      background-color: color.adjust(#006655, $lightness: 60%);
    }
  }

  &.btn-delete {
    color: #dc3545;
    &:hover {
      background-color: color.adjust(#dc3545, $lightness: 45%);
    }
  }
  &.btn-restore {
    color: #ff9800;
    &:hover {
      background-color: rgba(255, 152, 0, 0.1);
    }
  }
}
</style>
