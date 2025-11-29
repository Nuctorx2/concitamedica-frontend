<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div
          class="welcome-card p-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
        >
          <div>
            <h2 class="fw-bold text-white mb-1">
              {{ $t('app.welcome_user', { name: userName }) }} 👋
            </h2>
            <p class="text-white-50 mb-0">
              {{ $t('app.welcome_intro') }}
              <span class="fw-bold text-white">ConCitaMedica</span>.
              {{ $t('app.current_role') }}
              <span class="badge bg-accent">{{ userRoleLabel }}</span>
            </p>
          </div>
          <div class="d-none d-md-block">
            <i class="mdi mdi-hospital-building text-white opacity-25" style="font-size: 4rem"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4" v-if="canViewPatients">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-primary mb-3 mx-auto text-primary">
              <i class="mdi mdi-account-multiple"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.patients_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.patients_desc') }}
            </p>
            <RouterLink :to="{ name: 'pacientes' }" class="btn btn-outline-primary w-100 mt-2">
              {{ $t('dashboard.buttons.manage') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4" v-if="auth.isAdmin">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-primary mb-3 mx-auto text-primary">
              <i class="mdi mdi-doctor"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.doctors_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.doctors_desc') }}
            </p>
            <RouterLink :to="{ name: 'medicos' }" class="btn btn-outline-primary w-100 mt-2">
              {{ $t('dashboard.buttons.directory') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4" v-if="auth.isAdmin">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-accent mb-3 mx-auto text-accent">
              <i class="mdi mdi-calendar-multiple-check"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.admin_citas_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.admin_citas_desc') }}
            </p>
            <RouterLink to="/admin/citas" class="btn btn-outline-accent w-100 mt-2">
              {{ $t('dashboard.buttons.manage') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4" v-if="auth.isPaciente">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-accent mb-3 mx-auto text-accent">
              <i class="mdi mdi-calendar-clock"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.patient_citas_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.patient_citas_desc') }}
            </p>
            <RouterLink :to="{ name: 'citas' }" class="btn btn-outline-accent w-100 mt-2">
              {{ $t('dashboard.buttons.view_my_appointments') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4" v-if="auth.isMedico">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-accent mb-3 mx-auto text-accent">
              <i class="mdi mdi-calendar-text"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.doctor_agenda_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.doctor_agenda_desc') }}
            </p>
            <RouterLink :to="{ name: 'medico-agenda' }" class="btn btn-outline-accent w-100 mt-2">
              {{ $t('dashboard.buttons.view_agenda') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-neutral mb-3 mx-auto text-dark">
              <i class="mdi mdi-account-circle"></i>
            </div>
            <h5 class="card-title fw-bold">{{ $t('dashboard.cards.profile_title') }}</h5>
            <p class="card-text text-muted small">
              {{ $t('dashboard.cards.profile_desc') }}
            </p>
            <RouterLink :to="{ name: 'perfil' }" class="btn btn-outline-dark w-100 mt-2">
              {{ $t('dashboard.buttons.go_profile') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const { t } = useI18n()

const userName = computed(() => auth.user?.nombre || 'Usuario')
const userRoleRaw = computed(() => auth.user?.rol || '')

const isPaciente = computed(() => auth.isPaciente)

const citasRoute = computed(() => {
  if (auth.isMedico) {
    return { name: 'medico-agenda' }
  } else {
    return { name: 'citas' }
  }
})

const userRoleLabel = computed(() => {
  switch (userRoleRaw.value) {
    case 'ROLE_ADMIN':
      return t('roles.admin')
    case 'ROLE_MEDICO':
      return t('roles.doctor')
    case 'ROLE_PACIENTE':
      return t('roles.patient')
    default:
      return t('roles.guest')
  }
})

const canViewPatients = computed(
  () => userRoleRaw.value === 'ROLE_ADMIN' || userRoleRaw.value === 'ROLE_MEDICO',
)
</script>

<style scoped lang="scss">
@use 'sass:color';

$primary: #006655;
$accent: #ff5722;
$neutral: #e8f6f4;

.welcome-card {
  background: linear-gradient(135deg, $primary 0%, color.adjust($primary, $lightness: -10%) 100%);
}

.bg-accent {
  background-color: $accent !important;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;

  &.bg-light-primary {
    background-color: color.adjust($primary, $lightness: 55%);
    color: $primary;
  }
  &.bg-light-accent {
    background-color: color.adjust($accent, $lightness: 35%);
    color: $accent;
  }
  &.bg-light-neutral {
    background-color: darken($neutral, 10%);
    color: #333;
  }
}

.btn-outline-primary {
  border-color: $primary;
  color: $primary;
  &:hover {
    background-color: $primary;
    color: white;
  }
}

.btn-outline-accent {
  border-color: $accent;
  color: $accent;
  &:hover {
    background-color: $accent;
    color: white;
  }
}

.hover-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
}
</style>
