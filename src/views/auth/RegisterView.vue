<template>
  <div class="register-container d-flex align-items-center justify-content-center min-vh-100 py-5">
    <div
      class="card shadow-lg border-0 rounded-4 overflow-hidden"
      style="max-width: 700px; width: 100%"
    >
      <div class="card-header bg-primary text-white text-center py-4 position-relative">
        <RouterLink
          :to="{ name: 'login' }"
          class="btn btn-sm btn-white-outline position-absolute top-50 start-0 translate-middle-y ms-3"
        >
          <i class="mdi mdi-arrow-left"></i> Volver
        </RouterLink>
        <h4 class="mb-0 fw-bold">Crear Cuenta de Paciente</h4>
        <p class="small mb-0 opacity-75">Únete a ConCitaMedica para gestionar tu salud</p>
      </div>

      <div class="card-body p-4 p-md-5">
        <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center mb-4">
          <i class="mdi mdi-alert-circle me-2"></i>
          <div>{{ errorMsg }}</div>
        </div>

        <form @submit.prevent="handleRegister">
          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-account me-1"></i> Datos Personales
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <BaseInput
                id="nombre"
                label="Nombres"
                v-model="form.nombre"
                placeholder="Ej. Ana María"
                required
                minlength="2"
                maxlength="40"
                pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                title="Solo letras y espacios. Mínimo 2 caracteres."
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="apellido"
                label="Apellidos"
                v-model="form.apellido"
                placeholder="Ej. Pérez López"
                required
                minlength="2"
                maxlength="40"
                pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                title="Solo letras y espacios. Mínimo 2 caracteres."
              />
            </div>

            <div class="col-md-6">
              <BaseInput
                id="documento"
                label="Documento de Identidad"
                v-model="form.documento"
                icon="mdi-card-account-details"
                required
                minlength="8"
                maxlength="10"
                pattern="[0-9]{8,10}"
                title="Entre 8 y 10 dígitos numéricos."
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
          </div>

          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-map-marker me-1"></i> Información de Contacto
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <BaseInput
                id="telefono"
                label="Teléfono Móvil"
                v-model="form.telefono"
                icon="mdi-phone"
                required
                minlength="7"
                maxlength="15"
                pattern="[0-9]{7,15}"
                title="Solo números, entre 7 y 15 dígitos."
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="direccion"
                label="Dirección de Residencia"
                v-model="form.direccion"
                icon="mdi-home"
                minlength="5"
                maxlength="100"
                placeholder="Ej. Calle 123 # 45-67"
              />
            </div>
          </div>

          <h6 class="text-primary text-uppercase small fw-bold mb-3 border-bottom pb-2">
            <i class="mdi mdi-shield-account me-1"></i> Seguridad de la Cuenta
          </h6>
          <div class="row g-3 mb-4">
            <div class="col-12">
              <BaseInput
                id="email"
                label="Correo Electrónico"
                v-model="form.email"
                type="email"
                icon="mdi-email"
                required
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="password"
                label="Contraseña"
                v-model="form.password"
                type="password"
                icon="mdi-lock"
                required
                minlength="5"
                maxlength="50"
                title="Mínimo 5 caracteres."
              />
            </div>
            <div class="col-md-6">
              <BaseInput
                id="confirmPassword"
                label="Confirmar Contraseña"
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
              CREAR MI CUENTA
            </BaseButton>
          </div>

          <div class="text-center mt-4">
            <span class="text-muted">¿Ya tienes una cuenta? </span>
            <RouterLink
              :to="{ name: 'login' }"
              class="fw-bold text-primary text-decoration-none hover-link"
            >
              Inicia Sesión aquí
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
