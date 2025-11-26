<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark">Pacientes</h3>
        <p class="text-muted mb-0">Gestión del directorio de pacientes.</p>
      </div>

      <div class="d-flex align-items-center gap-3">
        <RouterLink v-if="auth.isAdmin" :to="{ name: 'pacientes-create' }" class="btn btn-primary">
          <i class="mdi mdi-plus me-1"></i> Nuevo Paciente
        </RouterLink>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 text-muted"
                ><i class="mdi mdi-magnify"></i
              ></span>
              <input
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Buscar por Nombre, Documento o Email..."
                v-model="textoBusqueda"
              />
            </div>
          </div>

          <div class="col-md-4" v-if="auth.isAdmin">
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

          <div class="col-md-3 text-end text-muted small">
            <strong>{{ pacientesFiltrados.length }}</strong> pacientes encontrados
          </div>
        </div>
      </div>
    </div>

    <div v-if="store.loading && !store.pacientes.length" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else class="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 text-secondary small text-uppercase">Paciente</th>
                <th class="py-3 text-secondary small text-uppercase">Documento</th>
                <th class="py-3 text-secondary small text-uppercase">Contacto</th>
                <th class="py-3 text-secondary small text-uppercase">Estado</th>
                <th
                  v-if="auth.isAdmin"
                  class="pe-4 py-3 text-end text-secondary small text-uppercase"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paciente in pacientesFiltrados" :key="paciente.id">
                <td class="ps-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-3 bg-soft-primary text-primary">
                      {{ getInitials(paciente.nombre, paciente.apellido) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">
                        {{ paciente.nombre }} {{ paciente.apellido }}
                      </div>
                      <div class="small text-muted">{{ paciente.email }}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="fw-bold text-dark">{{ paciente.documento }}</div>
                  <div class="small text-muted">{{ paciente.genero }}</div>
                </td>

                <td>
                  <div v-if="paciente.telefono">
                    <i class="mdi mdi-phone-outline me-1"></i>{{ paciente.telefono }}
                  </div>
                  <div v-else class="text-muted small">-</div>
                  <div class="small text-muted text-truncate" style="max-width: 150px">
                    {{ paciente.direccion }}
                  </div>
                </td>

                <td>
                  <span
                    class="badge rounded-pill border"
                    :class="
                      paciente.activo
                        ? 'bg-success-subtle text-success border-success-subtle'
                        : 'bg-secondary-subtle text-secondary border-secondary-subtle'
                    "
                  >
                    {{ paciente.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>

                <td v-if="auth.isAdmin" class="pe-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <RouterLink
                      v-if="paciente.activo"
                      :to="{ name: 'pacientes-edit', params: { id: paciente.id } }"
                      class="btn-icon btn-edit"
                      title="Editar"
                    >
                      <i class="mdi mdi-pencil-outline"></i>
                    </RouterLink>

                    <button
                      v-if="!paciente.activo"
                      class="btn-icon btn-restore"
                      title="Reactivar Paciente"
                      @click="reactivar(paciente.id)"
                    >
                      <i class="mdi mdi-refresh"></i>
                    </button>

                    <button
                      v-if="paciente.activo"
                      class="btn-icon btn-delete"
                      title="Inactivar Paciente"
                      @click="eliminar(paciente.id)"
                    >
                      <i class="mdi mdi-account-remove-outline"></i>
                    </button>
                  </div>
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
import { usePacientesStore } from '@/store/pacientes'
import { useAuthStore } from '@/store/auth'

const store = usePacientesStore()
const auth = useAuthStore()

const mostrarInactivos = ref(false)
const textoBusqueda = ref('')

onMounted(() => {
  store.fetchPacientes()
})

// Filtro Inteligente
const pacientesFiltrados = computed(() => {
  return store.pacientes.filter((p) => {
    // 1. Filtro Estado (Si no es admin, SIEMPRE solo activos)
    // Si es admin, depende del switch
    const mostrar = auth.isAdmin ? (mostrarInactivos.value ? true : p.activo) : p.activo
    if (!mostrar) return false

    // 2. Filtro Texto
    const texto = textoBusqueda.value.toLowerCase()
    const coincide =
      p.nombre.toLowerCase().includes(texto) ||
      p.apellido.toLowerCase().includes(texto) ||
      p.documento.includes(texto) ||
      (p.email && p.email.toLowerCase().includes(texto))

    return coincide
  })
})

// Helpers y Acciones
function getInitials(n: string, a: string) {
  return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase()
}

function eliminar(id: number) {
  if (confirm('¿Inactivar paciente? Se cancelarán sus citas futuras.')) {
    store.eliminarPaciente(id)
  }
}

function reactivar(id: number) {
  if (confirm('¿Reactivar paciente? Podrá volver a iniciar sesión.')) {
    store.reactivarPaciente(id)
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';

.bg-soft-primary {
  background-color: #e8f6f4;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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
  cursor: pointer;
  transition: all 0.2s;

  &.btn-edit {
    color: #006655;
    &:hover {
      background-color: rgba(0, 102, 85, 0.1);
    }
  }
  &.btn-delete {
    color: #dc3545;
    &:hover {
      background-color: rgba(220, 53, 69, 0.1);
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
