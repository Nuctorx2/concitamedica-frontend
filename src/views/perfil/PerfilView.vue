<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <h3 class="fw-bold mb-4 text-dark">Mi Perfil</h3>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-4">
              <div class="avatar-large me-3 bg-primary text-white">
                {{ initials }}
              </div>
              <div>
                <h5 class="fw-bold mb-0">{{ authStore.user?.nombre }}</h5>
                <p class="text-muted mb-0">{{ authStore.user?.email }}</p>
                <span class="badge bg-light text-dark border mt-1">{{ userRole }}</span>
              </div>
            </div>

            <hr class="opacity-10 my-4" />

            <form @submit.prevent="handleUpdate">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput id="nombre" label="Nombre" v-model="form.nombre" required />
                </div>
                <div class="col-md-6">
                  <BaseInput id="apellido" label="Apellido" v-model="form.apellido" required />
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
                    id="direccion"
                    label="Dirección"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                  />
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 mt-4">
                <button type="button" class="btn btn-light text-danger" @click="changePassword">
                  <i class="mdi mdi-lock-reset me-1"></i> Cambiar Contraseña
                </button>
                <BaseButton type="submit" :loading="saving" style="max-width: 200px">
                  Actualizar Datos
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import authService from '@/services/authService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const saving = ref(false)

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
})

// Computed
const initials = computed(() => {
  const n = authStore.user?.nombre || ''
  return n.substring(0, 2).toUpperCase()
})

const userRole = computed(() => {
  const r = authStore.user?.rol || ''
  return r.replace('ROLE_', '')
})

// Cargar datos frescos al montar
onMounted(async () => {
  try {
    // Pedimos los datos frescos al backend por si algo cambió
    const user = await authService.getMe()

    // Llenamos el formulario
    form.nombre = user.nombre
    form.apellido = user.apellido || '' // Manejo de posibles nulls antiguos
    form.documento = user.documento || ''
    form.telefono = user.telefono || ''
    form.direccion = user.direccion || ''
    form.fechaNacimiento = user.fechaNacimiento || ''
    form.genero = user.genero || 'OTRO'
  } catch (e) {
    console.error('Error cargando perfil')
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    await authStore.actualizarPerfil(form)
    alert('Perfil actualizado correctamente')
  } catch (e) {
    alert('Error al actualizar el perfil')
  } finally {
    saving.value = false
  }
}

function changePassword() {
  alert('Funcionalidad de cambio de contraseña pendiente de implementar.')
}
</script>

<style scoped lang="scss">
.avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
