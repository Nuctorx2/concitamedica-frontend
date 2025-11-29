<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <h3 class="fw-bold mb-4 text-dark">{{ $t('profile.title') }}</h3>

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
                  <BaseInput
                    id="nombre"
                    :label="$t('profile.form.name')"
                    v-model="form.nombre"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="apellido"
                    :label="$t('profile.form.surname')"
                    v-model="form.apellido"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    :label="$t('profile.form.document')"
                    v-model="form.documento"
                    icon="mdi-card-account-details"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="fechaNacimiento"
                    :label="$t('profile.form.birthdate')"
                    v-model="form.fechaNacimiento"
                    type="date"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">
                    {{ $t('profile.form.gender') }}
                  </label>
                  <select class="form-select py-2" v-model="form.genero" required>
                    <option value="MASCULINO">{{ $t('common.gender_MASCULINO') }}</option>
                    <option value="FEMENINO">{{ $t('common.gender_FEMENINO') }}</option>
                    <option value="OTRO">{{ $t('common.gender_OTRO') }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="telefono"
                    :label="$t('profile.form.phone')"
                    v-model="form.telefono"
                    icon="mdi-phone"
                    required
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    :label="$t('profile.form.address')"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                  />
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <button type="button" class="btn btn-outline-danger" @click="togglePasswordForm">
                  <i class="mdi" :class="showPasswordForm ? 'mdi-close' : 'mdi-lock-reset'"></i>
                  {{
                    showPasswordForm
                      ? $t('profile.security.btn_cancel')
                      : $t('profile.security.btn_change')
                  }}
                </button>

                <BaseButton
                  v-if="!showPasswordForm"
                  type="submit"
                  :loading="saving"
                  style="max-width: 200px"
                >
                  {{ $t('profile.buttons.update') }}
                </BaseButton>
              </div>

              <div
                v-if="showPasswordForm"
                class="mt-4 p-4 bg-light rounded-3 border border-danger-subtle"
              >
                <h6 class="text-danger fw-bold mb-3">
                  <i class="mdi mdi-shield-key me-1"></i> {{ $t('profile.security.title') }}
                </h6>

                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label small fw-bold">
                      {{ $t('profile.security.current_label') }}
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="passForm.actual"
                      :placeholder="$t('profile.security.current_placeholder')"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small fw-bold">
                      {{ $t('profile.security.new_label') }}
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="passForm.nueva"
                      :placeholder="$t('profile.security.new_placeholder')"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small fw-bold">
                      {{ $t('profile.security.confirm_label') }}
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="passForm.confirmacion"
                      :placeholder="$t('profile.security.confirm_placeholder')"
                    />
                  </div>

                  <div class="col-12 text-end mt-3">
                    <button
                      type="button"
                      class="btn btn-danger px-4"
                      :disabled="saving"
                      @click="handleChangePassword"
                    >
                      <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                      {{ $t('profile.security.btn_confirm') }}
                    </button>
                  </div>
                </div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showPasswordForm = ref(false)
const passForm = reactive({
  actual: '',
  nueva: '',
  confirmacion: '',
})

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

const initials = computed(() => {
  const n = authStore.user?.nombre || ''
  return n.substring(0, 2).toUpperCase()
})

const userRole = computed(() => {
  const r = authStore.user?.rol || ''
  const cleanRole = r.replace('ROLE_', '').toLowerCase()
  return t(`roles.${cleanRole}`)
})

onMounted(async () => {
  try {
    const user = await authService.getMe()

    form.nombre = user.nombre
    form.apellido = user.apellido || ''
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
    alert(t('profile.messages.success_update'))
  } catch (e) {
    alert(t('profile.messages.error_update'))
  } finally {
    saving.value = false
  }
}

async function handleChangePassword() {
  if (passForm.nueva !== passForm.confirmacion) {
    alert(t('profile.messages.error_mismatch'))
    return
  }

  saving.value = true
  try {
    await authStore.cambiarPassword(passForm.actual, passForm.nueva)
    alert(t('profile.messages.success_password'))
    authStore.logout()
  } catch (e: any) {
    const msg = e.response?.data?.message || t('profile.messages.error_password')
    alert(msg)
  } finally {
    saving.value = false
  }
}

function togglePasswordForm() {
  showPasswordForm.value = !showPasswordForm.value
  passForm.actual = ''
  passForm.nueva = ''
  passForm.confirmacion = ''
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
