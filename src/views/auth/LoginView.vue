<template>
  <div class="login-container d-flex align-items-center justify-content-center min-vh-100">
    <div class="position-absolute top-0 end-0 m-4">
      <LanguageSwitcher />
    </div>
    <div
      class="card shadow-lg border-0 rounded-4 overflow-hidden"
      style="max-width: 400px; width: 100%"
    >
      <div class="card-header bg-primary text-white text-center py-4">
        <h3 class="mb-0 fw-bold">{{ $t('app.title') }}</h3>
        <p class="small mb-0 opacity-75">{{ $t('auth.login_subtitle') }}</p>
      </div>

      <div class="card-body p-4 p-md-5">
        <h4 class="text-center mb-4 text-dark fw-bold">{{ $t('auth.login_title') }}</h4>

        <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="mdi mdi-alert-circle me-2"></i>
          <div>{{ errorMessage }}</div>
        </div>

        <form @submit.prevent="handleLogin">
          <BaseInput
            id="email"
            :label="$t('auth.email')"
            v-model="credentials.email"
            type="email"
            :placeholder="$t('auth.email_placeholder')"
            icon="mdi-email-outline"
            required
          />

          <BaseInput
            id="password"
            :label="$t('auth.password')"
            v-model="credentials.password"
            type="password"
            :placeholder="$t('auth.password_placeholder')"
            icon="mdi-lock-outline"
            required
          />

          <div class="d-flex justify-content-end mb-3">
            <RouterLink to="/recuperar" class="text-decoration-none small text-muted">
              {{ $t('auth.forgot_password') }}
            </RouterLink>
          </div>

          <BaseButton type="submit" :loading="isLoading" variant="primary">
            {{ $t('auth.login_btn') }}
          </BaseButton>
        </form>

        <div class="text-center mt-4">
          <p class="small text-muted">
            {{ $t('auth.no_account') }}
            <RouterLink
              :to="{ name: 'register' }"
              class="fw-bold text-primary text-decoration-none"
            >
              {{ $t('auth.register_link') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const credentials = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: credentials.email,
      password: credentials.password,
    })
  } catch (error: any) {
    console.error(error)
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Credenciales incorrectas. Verifique su correo y contraseña.'
    } else {
      errorMessage.value = 'Ocurrió un error inesperado. Intente nuevamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.bg-primary {
  background-color: #006655 !important;
}

.login-container {
  background-color: #e8f6f4;
}
</style>
