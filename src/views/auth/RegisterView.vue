<template>
  <div class="register-container d-flex align-items-center justify-content-center min-vh-100 py-5">
    <div class="position-absolute top-0 end-0 m-4">
      <LanguageSwitcher />
    </div>
    <div
      class="card shadow-lg border-0 rounded-4 overflow-hidden"
      style="max-width: 700px; width: 100%"
    >
      <div class="card-header bg-primary text-white text-center py-4 position-relative">
        <RouterLink
          :to="{ name: 'login' }"
          class="btn btn-sm btn-white-outline position-absolute top-50 start-0 translate-middle-y ms-3"
        >
          <i class="mdi mdi-arrow-left"></i> {{ $t('common.back') }}
        </RouterLink>
        <h4 class="mb-0 fw-bold">{{ $t('auth.register_title_patient') }}</h4>
        <p class="small mb-0 opacity-75">{{ $t('auth.register_subtitle') }}</p>
      </div>

      <div class="card-body p-4 p-md-5">
        <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center mb-4">
          <i class="mdi mdi-alert-circle me-2"></i>
          <div>{{ errorMsg }}</div>
        </div>

        <form @submit.prevent="handleRegister">
          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-account me-1"></i> {{ $t('auth.personal_info') }}
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <BaseInput
                id="nombre"
                :label="$t('auth.names')"
                v-model="form.nombre"
                :placeholder="$t('auth.placeholder_names')"
                required
                minlength="2"
                maxlength="40"
                pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                :title="$t('auth.help_names')"
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="apellido"
                :label="$t('auth.surnames')"
                v-model="form.apellido"
                :placeholder="$t('auth.placeholder_surnames')"
                required
                minlength="2"
                maxlength="40"
                pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                :title="$t('auth.help_names')"
              />
            </div>

            <div class="col-md-6">
              <BaseInput
                id="documento"
                :label="$t('auth.document_id')"
                v-model="form.documento"
                icon="mdi-card-account-details"
                required
                minlength="8"
                maxlength="10"
                pattern="[0-9]{8,10}"
                :title="$t('auth.help_document')"
              />
            </div>

            <div class="col-md-6">
              <BaseInput
                id="fechaNacimiento"
                :label="$t('auth.birthdate')"
                v-model="form.fechaNacimiento"
                type="date"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold text-secondary"
                >{{ $t('auth.gender') }} <span class="text-danger">*</span></label
              >
              <select class="form-select py-2" v-model="form.genero" required>
                <option value="" disabled>{{ $t('common.select_placeholder') }}</option>
                <option value="MASCULINO">{{ $t('common.gender_male') }}</option>
                <option value="FEMENINO">{{ $t('common.gender_female') }}</option>
                <option value="OTRO">{{ $t('common.gender_other') }}</option>
              </select>
            </div>
          </div>

          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-map-marker me-1"></i> {{ $t('auth.contact_info') }}
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <BaseInput
                id="telefono"
                :label="$t('auth.mobile_phone')"
                v-model="form.telefono"
                icon="mdi-phone"
                required
                minlength="7"
                maxlength="15"
                pattern="[0-9]{7,15}"
                :title="$t('auth.help_phone')"
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="direccion"
                :label="$t('auth.address')"
                v-model="form.direccion"
                icon="mdi-home"
                minlength="5"
                maxlength="100"
                :placeholder="$t('auth.placeholder_address')"
              />
            </div>
          </div>

          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-shield-account me-1"></i> {{ $t('auth.account_security') }}
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-12">
              <BaseInput
                id="email"
                :label="$t('auth.email')"
                v-model="form.email"
                type="email"
                icon="mdi-email"
                required
                :placeholder="$t('auth.email_placeholder')"
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="password"
                :label="$t('auth.password')"
                v-model="form.password"
                type="password"
                icon="mdi-lock"
                required
                minlength="5"
                maxlength="50"
                :title="$t('auth.help_password_min')"
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="confirmPassword"
                :label="$t('auth.confirm_password')"
                v-model="confirmPassword"
                type="password"
                icon="mdi-lock-check"
                required
                minlength="5"
              />
            </div>
          </div>

          <div class="d-grid gap-2 mt-5">
            <BaseButton type="submit" :loading="loading" class="py-3 fs-6">
              {{ $t('auth.create_account_btn') }}
            </BaseButton>
          </div>

          <div class="text-center mt-4">
            <span class="text-muted">{{ $t('auth.already_have_account') }} </span>
            <RouterLink
              :to="{ name: 'login' }"
              class="fw-bold text-primary text-decoration-none hover-link"
            >
              {{ $t('auth.login_here') }}
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const confirmPassword = ref('')

// Objeto reactivo con TODOS los campos requeridos por RegistroUsuarioDTO
const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  fechaNacimiento: '',
  genero: '', // El select lo llena
  telefono: '', // Requerido ahora por DTO
  direccion: '', // Opcional en DB, pero lo pedimos
  email: '',
  password: '',
  // Nota: NO enviamos 'rol'. El backend asigna ROLE_PACIENTE por defecto.
})

async function handleRegister() {
  // 1. Validación local de contraseñas
  if (form.password !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden. Por favor verifica.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    // 2. Llamada al servicio
    await authService.register(form)

    // 3. Éxito
    alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.')
    router.push({ name: 'login' })
  } catch (e: any) {
    // 4. Manejo de errores (Backend messages)
    console.error('Error registro:', e)

    const backendMessage = e.response?.data?.message
    if (backendMessage) {
      errorMsg.value = backendMessage // Ej: "El email ya está registrado"
    } else if (e.response?.status === 400) {
      errorMsg.value = 'Datos inválidos. Por favor revisa la información ingresada.'
    } else {
      errorMsg.value = 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';

$primary: #006655;

.register-container {
  background-color: #e8f6f4; // Neutro de tu paleta
  min-height: 100vh;
}

.bg-primary {
  background-color: $primary !important;
}

.btn-white-outline {
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  &:hover {
    background-color: white;
    color: $primary;
  }
}

.hover-link:hover {
  text-decoration: underline !important;
  color: color.adjust($primary, $lightness: -10%);
}
</style>
