<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div
          class="welcome-card p-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
        >
          <div>
            <h2 class="fw-bold text-white mb-1">¡Hola, {{ userName }}! 👋</h2>
            <p class="text-white-50 mb-0">
              Bienvenido al panel de control de
              <span class="fw-bold text-white">ConCitaMedica</span>. Tu rol actual es:
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
            <h5 class="card-title fw-bold">Pacientes</h5>
            <p class="card-text text-muted small">
              Administra el directorio de pacientes y sus historias.
            </p>
            <RouterLink :to="{ name: 'pacientes' }" class="btn btn-outline-primary w-100 mt-2">
              Gestionar
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <div class="card-body text-center p-4">
            <div class="icon-circle bg-light-accent mb-3 mx-auto text-accent">
              <i class="mdi mdi-calendar-clock"></i>
            </div>
            <h5 class="card-title fw-bold">Citas Médicas</h5>
            <p class="card-text text-muted small">
              {{ isPaciente ? 'Agenda tu próxima consulta.' : 'Revisa la agenda del día.' }}
            </p>
            <RouterLink :to="{ name: 'citas' }" class="btn btn-outline-accent w-100 mt-2">
              {{ isPaciente ? 'Agendar Cita' : 'Ver Agenda' }}
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
            <h5 class="card-title fw-bold">Mi Perfil</h5>
            <p class="card-text text-muted small">Actualiza tus datos personales y contraseña.</p>
            <RouterLink :to="{ name: 'perfil' }" class="btn btn-outline-dark w-100 mt-2">
              Ir al Perfil
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

const auth = useAuthStore()

// Datos computados para la vista
const userName = computed(() => auth.user?.nombre || 'Usuario')
const userRoleRaw = computed(() => auth.user?.rol || '')

// Lógica visual
const isPaciente = computed(() => auth.isPaciente)

const userRoleLabel = computed(() => {
  switch (userRoleRaw.value) {
    case 'ROLE_ADMIN':
      return 'Administrador'
    case 'ROLE_MEDICO':
      return 'Médico'
    case 'ROLE_PACIENTE':
      return 'Paciente'
    default:
      return 'Invitado'
  }
})

const canViewPatients = computed(
  () => userRoleRaw.value === 'ROLE_ADMIN' || userRoleRaw.value === 'ROLE_MEDICO',
)
</script>

<style scoped lang="scss">
@use 'sass:color';

// Variables locales basadas en tu paleta
$primary: #006655;
$accent: #ff5722;
$neutral: #e8f6f4;

.welcome-card {
  background: linear-gradient(135deg, $primary 0%, color.adjust($primary, $lightness: -10%) 100%);
}

.bg-accent {
  background-color: $accent !important;
}

// Estilos para los círculos de iconos
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

// Botones outline personalizados
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
