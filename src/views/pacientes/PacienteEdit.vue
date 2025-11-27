<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="mb-3">
          <RouterLink :to="{ name: 'pacientes' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> Volver
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold mb-0">Editar Paciente</h4>
              <span
                v-if="store.loading"
                class="spinner-border spinner-border-sm text-primary"
              ></span>
            </div>

            <div v-if="store.error" class="alert alert-danger">
              {{ store.error }}
            </div>

            <form v-else @submit.prevent="handleUpdate">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput
                    id="nombre"
                    label="Nombre"
                    v-model="form.nombre"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    title="Solo letras, espacios, acentos, guiones o apóstrofes. Entre 2 y 40 caracteres."
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="apellido"
                    label="Apellido"
                    v-model="form.apellido"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    title="Solo letras, espacios, acentos, guiones o apóstrofes. Entre 2 y 40 caracteres."
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    label="Documento"
                    v-model="form.documento"
                    icon="mdi-card-account-details"
                    required
                    minlength="8"
                    maxlength="10"
                    pattern="[0-9]{8,10}"
                    title="Entre 8 y 10 dígitos numéricos (sin puntos ni espacios)"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="fechaNacimiento"
                    label="Fecha Nacimiento"
                    v-model="form.fechaNacimiento"
                    type="date"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">Género</label>
                  <select class="form-select py-2" v-model="form.genero" required>
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
                    minlength="7"
                    maxlength="15"
                    pattern="[0-9]{7,15}"
                    title="Entre 7 y 15 números"
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
                    title="Formato válido requerido: usuario@dominio.com"
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    label="Dirección"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                    minlength="5"
                    maxlength="100"
                    title="Debe tener entre 5 y 100 caracteres."
                  />
                </div>
              </div>

              <div class="d-flex gap-3 mt-4">
                <RouterLink :to="{ name: 'pacientes' }" class="btn btn-light flex-grow-1"
                  >Cancelar</RouterLink
                >
                <BaseButton type="submit" :loading="saving" class="flex-grow-1">
                  Guardar Cambios
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacientesStore } from '@/store/pacientes'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const store = usePacientesStore()

const saving = ref(false)
// Obtenemos el ID de la URL (/pacientes/1)
const pacienteId = Number(route.params.id)

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
})

onMounted(async () => {
  // 1. Cargar datos del backend
  await store.fetchPacienteById(pacienteId)

  // 2. Si existe, llenar el formulario
  if (store.pacienteActual) {
    const p = store.pacienteActual
    form.nombre = p.nombre
    form.apellido = p.apellido
    form.documento = p.documento
    form.email = p.email
    form.telefono = p.telefono
    form.direccion = p.direccion
    // El backend probablemente devuelve array [yyyy, mm, dd] o string ISO.
    // Si es array, hay que formatear. Si es string 'YYYY-MM-DD', funciona directo.
    form.fechaNacimiento = p.fechaNacimiento
    form.genero = p.genero || 'OTRO'
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    await store.actualizarPaciente(pacienteId, form)
    alert('Paciente actualizado correctamente')
    router.push({ name: 'pacientes' })
  } catch (error) {
    alert('Error al actualizar')
  } finally {
    saving.value = false
  }
}
</script>
