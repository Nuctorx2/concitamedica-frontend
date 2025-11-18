<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark">Pacientes</h3>
        <p class="text-muted mb-0">Gestión del directorio de pacientes</p>
      </div>
      <RouterLink :to="{ name: 'pacientes-create' }" class="btn btn-primary">
        <i class="mdi mdi-plus me-1"></i> Nuevo Paciente
      </RouterLink>
    </div>

    <div v-if="store.loading && !store.pacientes.length" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Cargando pacientes...</p>
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
                <th class="ps-4 py-3 text-secondary small text-uppercase">Paciente</th>
                <th class="py-3 text-secondary small text-uppercase">Documento</th>
                <th class="py-3 text-secondary small text-uppercase">Contacto</th>
                <th class="pe-4 py-3 text-end text-secondary small text-uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paciente in store.pacientes" :key="paciente.id">
                <td class="ps-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-3 bg-soft-primary text-primary">
                      {{ getInitials(paciente.nombre, paciente.apellido) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">
                        {{ paciente.nombre }} {{ paciente.apellido }}
                      </div>
                      <div class="small text-muted">{{ paciente.email || 'Sin email' }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ paciente.documento }}</td>
                <td>
                  <div v-if="paciente.telefono">
                    <i class="mdi mdi-phone-outline me-1"></i>{{ paciente.telefono }}
                  </div>
                  <div v-else class="text-muted small">-</div>
                </td>
                <td class="pe-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <RouterLink
                      :to="{ name: 'pacientes-edit', params: { id: paciente.id } }"
                      class="btn-icon btn-edit"
                      title="Editar Paciente"
                    >
                      <i class="mdi mdi-pencil-outline"></i>
                    </RouterLink>

                    <button
                      class="btn-icon btn-delete"
                      title="Eliminar Paciente"
                      @click="deletePaciente(paciente.id)"
                    >
                      <i class="mdi mdi-trash-can-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="store.pacientes.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <i class="mdi mdi-account-off fs-1 d-block mb-2"></i>
                  No hay pacientes registrados aún.
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
import { onMounted } from 'vue'
import { usePacientesStore } from '@/store/pacientes'

const store = usePacientesStore()

onMounted(() => {
  store.fetchPacientes()
})

// Helper visual para las iniciales
function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

async function deletePaciente(id: number) {
  if (confirm('¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
    await store.eliminarPaciente(id)
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';

.bg-soft-primary {
  background-color: #e8f6f4; // Tu color neutro
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; // Botones redondos
  border: 1px solid transparent;
  background-color: transparent;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  text-decoration: none; // Para el RouterLink
  cursor: pointer;

  // Estilo para Editar (Azul/Verde)
  &.btn-edit {
    color: #006655; // Tu color principal
    &:hover {
      background-color: color.adjust(#006655, $lightness: 60%);
      border-color: color.adjust(#006655, $lightness: 40%);
    }
  }

  // Estilo para Eliminar (Rojo)
  &.btn-delete {
    color: #dc3545;
    &:hover {
      background-color: color.adjust(#dc3545, $lightness: 45%);
      border-color: color.adjust(#dc3545, $lightness: 30%);
    }
  }
}
</style>
