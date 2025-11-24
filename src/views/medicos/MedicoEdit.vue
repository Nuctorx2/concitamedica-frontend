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
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold text-primary mb-0">Editar Médico</h4>
              <span v-if="loading" class="spinner-border spinner-border-sm text-secondary"></span>
            </div>

            <form @submit.prevent="handleUpdate" v-if="!loading">
              <div class="row g-3 mb-4">
                <div class="col-md-12">
                  <label class="form-label fw-bold text-secondary">Especialidad</label>
                  <select class="form-select py-2" v-model="form.especialidadId" required>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
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
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <BaseInput id="telefono" label="Teléfono" v-model="form.telefono" required />
                </div>
                <div class="col-12">
                  <BaseInput id="direccion" label="Dirección" v-model="form.direccion" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold text-secondary">Email (No editable)</label>
                  <input type="text" class="form-control" :value="emailReadOnly" disabled />
                </div>
              </div>

              <div class="d-flex gap-3">
                <RouterLink :to="{ name: 'medicos' }" class="btn btn-light flex-grow-1"
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMedicosStore } from '@/store/medicos'
import especialidadesService, { type Especialidad } from '@/services/especialidadesService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const store = useMedicosStore()

const medicoId = Number(route.params.id)
const loading = ref(true)
const saving = ref(false)
const especialidades = ref<Especialidad[]>([])
const emailReadOnly = ref('')

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  especialidadId: 0,
})

onMounted(async () => {
  try {
    // 1. Cargar catálogos
    especialidades.value = await especialidadesService.getAll()

    // 2. Cargar médico
    await store.fetchMedicoById(medicoId)

    // 3. Llenar formulario
    if (store.medicoActual) {
      const m = store.medicoActual
      form.nombre = m.nombre
      form.apellido = m.apellido
      form.documento = m.documento
      form.telefono = m.telefono
      form.direccion = m.direccion
      form.fechaNacimiento = m.fechaNacimiento
      form.genero = m.genero
      form.especialidadId = m.especialidadId

      emailReadOnly.value = m.email
    }
  } catch (e) {
    alert('Error al cargar datos')
    router.push({ name: 'medicos' })
  } finally {
    loading.value = false
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    await store.actualizarMedico(medicoId, form)
    alert('Datos actualizados correctamente')
    router.push({ name: 'medicos' })
  } catch (e) {
    alert('Error al guardar cambios')
  } finally {
    saving.value = false
  }
}
</script>
