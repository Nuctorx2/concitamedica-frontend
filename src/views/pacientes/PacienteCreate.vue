<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="mb-3">
          <RouterLink :to="{ name: 'pacientes' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> Volver a la lista
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4">Registrar Nuevo Paciente</h4>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput
                    id="nombre"
                    label="Nombre"
                    v-model="form.nombre"
                    placeholder="Ej. Juan"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="apellido"
                    label="Apellido"
                    v-model="form.apellido"
                    placeholder="Ej. Pérez"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    label="Documento"
                    v-model="form.documento"
                    icon="mdi-card-account-details"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    v-model="form.fechaNacimiento"
                    type="date"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">Género</label>
                  <select class="form-select py-2" v-model="form.genero" required>
                    <option value="" disabled>Seleccione...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="telefono"
                    label="Teléfono"
                    v-model="form.telefono"
                    icon="mdi-phone"
                    required
                  />
                </div>
                <div class="col-12">
                  <BaseInput
                    id="email"
                    label="Email"
                    v-model="form.email"
                    type="email"
                    icon="mdi-email"
                    required
                  />
                </div>
                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    label="Dirección"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                  />
                </div>
              </div>

              <div class="d-flex gap-3 mt-4">
                <RouterLink :to="{ name: 'pacientes' }" class="btn btn-light flex-grow-1"
                  >Cancelar</RouterLink
                >
                <BaseButton type="submit" :loading="store.loading" class="flex-grow-1">
                  Guardar Paciente
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePacientesStore } from '@/store/pacientes'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { PacienteCreateRequest } from '@/services/pacientesService' // Asegúrate de importar el tipo

const router = useRouter()
const store = usePacientesStore()

// Inicializamos con todos los campos requeridos por el Backend
const form = reactive<PacienteCreateRequest>({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  password: '',
})

async function handleSubmit() {
  try {
    await store.crearPaciente(form)
    router.push({ name: 'pacientes' })
  } catch (error) {
    // El manejo de error ya está en el store
  }
}
</script>
