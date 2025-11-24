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
                <th class="pe-4 py-3 text-end text-uppercase text-secondary small">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="medico in store.medicos" :key="medico.id">
                <td class="ps-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-3 bg-white border text-primary">
                      <i class="mdi mdi-doctor"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ medico.nombre }}</div>
                      <div class="small text-muted">ID: {{ medico.id }}</div>
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
                </td>

                <td class="pe-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <RouterLink
                      :to="{ name: 'medicos-edit', params: { id: medico.id } }"
                      class="btn-icon btn-edit"
                      title="Editar"
                    >
                      <i class="mdi mdi-pencil-outline"></i>
                    </RouterLink>

                    <button
                      class="btn-icon btn-delete"
                      title="Dar de baja"
                      @click="eliminarMedico(medico.id)"
                    >
                      <i class="mdi mdi-account-remove-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="store.medicos.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <i class="mdi mdi-doctor-off fs-1 d-block mb-2 opacity-50"></i>
                  No hay médicos registrados en el sistema.
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
import { useMedicosStore } from '@/store/medicos'

const store = useMedicosStore()

onMounted(() => {
  store.fetchMedicos()
})

function eliminarMedico(id: number) {
  if (confirm('¿Estás seguro de dar de baja a este médico? Se perderá acceso a su agenda.')) {
    store.eliminarMedico(id)
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

// Reutilizamos tus estilos de botones circulares
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
}
</style>
