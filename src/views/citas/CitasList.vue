<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark">Mis Citas Médicas</h3>
        <p class="text-muted mb-0">Consulta tus próximas visitas y el historial.</p>
      </div>
      <RouterLink :to="{ name: 'citas-create' }" class="btn btn-primary fw-bold">
        <i class="mdi mdi-plus-circle-outline me-1"></i> Agendar Cita
      </RouterLink>
    </div>

    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Cargando tu agenda...</p>
    </div>

    <div v-else-if="store.error" class="alert alert-danger">
      <i class="mdi mdi-alert-circle me-2"></i> {{ store.error }}
    </div>

    <div v-else-if="store.misCitas.length === 0" class="text-center py-5">
      <div class="empty-state-icon mb-3">
        <i class="mdi mdi-calendar-blank text-muted opacity-25" style="font-size: 4rem"></i>
      </div>
      <h5 class="fw-bold text-secondary">No tienes citas programadas</h5>
      <p class="text-muted">Agenda tu primera consulta médica ahora mismo.</p>
      <RouterLink :to="{ name: 'citas-create' }" class="btn btn-outline-primary mt-2">
        Comenzar
      </RouterLink>
    </div>

    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="cita in store.misCitas" :key="cita.id">
        <div class="card border-0 shadow-sm h-100 appointment-card">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="date-badge text-center">
                <div class="month">{{ getMonth(cita.fechaHoraInicio) }}</div>
                <div class="day fw-bold">{{ getDay(cita.fechaHoraInicio) }}</div>
              </div>
              <span class="badge bg-light text-dark border">
                {{ formatTime(cita.fechaHoraInicio) }}
              </span>
            </div>

            <h5 class="fw-bold mb-1">{{ cita.nombreMedico }}</h5>
            <p class="text-muted small mb-3">Especialista</p>

            <hr class="opacity-10" />

            <div class="d-flex justify-content-between align-items-center">
              <span class="badge" :class="getStatusBadgeClass(cita.estado)">
                {{ cita.estado }}
              </span>

              <button class="btn btn-sm btn-light rounded-circle" title="Ver detalles">
                <i class="mdi mdi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCitasStore } from '@/store/citas'

const store = useCitasStore()

onMounted(() => {
  store.fetchMisCitas()
})

// --- Helpers de Formato ---

function getMonth(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
}

function getDay(isoString: string) {
  const date = new Date(isoString)
  return date.getDate()
}

function formatTime(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'AGENDADA':
      return 'bg-success-subtle text-success border border-success-subtle'
    case 'CANCELADA':
      return 'bg-danger-subtle text-danger border border-danger-subtle'
    case 'REALIZADA':
      return 'bg-secondary-subtle text-secondary'
    default:
      return 'bg-light text-dark'
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';

$primary: #006655;

.date-badge {
  background-color: color.adjust($primary, $lightness: 55%);
  color: $primary;
  padding: 5px 10px;
  border-radius: 8px;
  line-height: 1.2;

  .month {
    font-size: 0.7rem;
  }
  .day {
    font-size: 1.2rem;
  }
}

.appointment-card {
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-3px);
  }
}
</style>
