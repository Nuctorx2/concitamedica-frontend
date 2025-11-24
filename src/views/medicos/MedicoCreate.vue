<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="mb-3">
          <RouterLink :to="{ name: 'medicos' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> Volver al directorio
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4 text-primary">Registrar Nuevo Médico</h4>

            <form @submit.prevent="handleSubmit">
              <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                Información Profesional
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary"
                    >Especialidad <span class="text-danger">*</span></label
                  >
                  <select class="form-select py-2" v-model="form.especialidadId" required>
                    <option :value="null" disabled>Seleccione una especialidad...</option>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="email"
                    label="Correo Institucional"
                    v-model="form.email"
                    type="email"
                    icon="mdi-email"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="password"
                    label="Contraseña Temporal"
                    v-model="form.password"
                    type="password"
                    icon="mdi-lock"
                    required
                  />
                </div>
              </div>

              <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                Datos Personales
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <BaseInput id="nombre" label="Nombres" v-model="form.nombre" required />
                </div>
                <div class="col-md-6">
                  <BaseInput id="apellido" label="Apellidos" v-model="form.apellido" required />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    label="Documento ID"
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
                  <label class="form-label fw-bold text-secondary"
                    >Género <span class="text-danger">*</span></label
                  >
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
                    label="Teléfono Móvil"
                    v-model="form.telefono"
                    icon="mdi-phone"
                    required
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    label="Dirección de Residencia"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                  />
                </div>
              </div>

              <div v-if="errorMsg" class="alert alert-danger mb-3">
                <i class="mdi mdi-alert-circle"></i> {{ errorMsg }}
              </div>

              <div class="d-flex gap-3">
                <RouterLink :to="{ name: 'medicos' }" class="btn btn-light flex-grow-1"
                  >Cancelar</RouterLink
                >
                <BaseButton type="submit" :loading="loading" class="flex-grow-1">
                  Contratar Médico
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMedicosStore } from '@/store/medicos'
import especialidadesService, { type Especialidad } from '@/services/especialidadesService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const store = useMedicosStore()

const loading = ref(false)
const errorMsg = ref('')
const especialidades = ref<Especialidad[]>([])

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  password: '', // Se enviará para crear el usuario
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  especialidadId: null as number | null,
})

onMounted(async () => {
  // Cargar catálogo de especialidades
  try {
    especialidades.value = await especialidadesService.getAll()
  } catch (e) {
    errorMsg.value = 'No se pudieron cargar las especialidades.'
  }
})

async function handleSubmit() {
  if (!form.especialidadId) {
    errorMsg.value = 'Debes seleccionar una especialidad.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    // TypeScript necesita asegurar que especialidadId es number, no null
    await store.crearMedico({
      ...form,
      especialidadId: form.especialidadId!,
    })

    alert('Médico registrado exitosamente.')
    router.push({ name: 'medicos' })
  } catch (e: any) {
    // Manejo de errores del backend (ej. Email duplicado)
    if (e.response && e.response.data && e.response.data.message) {
      errorMsg.value = e.response.data.message
    } else {
      errorMsg.value = 'Error al crear el perfil del médico.'
    }
  } finally {
    loading.value = false
  }
}
</script>
