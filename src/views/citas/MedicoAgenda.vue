<template>
  <div class="container-fluid">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3"
    >
      <div>
        <h3 class="fw-bold text-dark">{{ $t('appointments.agenda_title') }}</h3>
        <p class="text-muted mb-0">{{ $t('appointments.agenda_subtitle') }}</p>
      </div>

      <div class="d-flex align-items-center bg-white p-2 rounded-3 shadow-sm border">
        <button class="btn btn-light btn-sm rounded-circle me-2" @click="cambiarDia(-1)">
          <i class="mdi mdi-chevron-left"></i>
        </button>

        <input
          type="date"
          class="form-control border-0 fw-bold text-center"
          style="width: 140px"
          v-model="fechaSeleccionada"
          @change="cargarAgenda"
        />

        <button class="btn btn-light btn-sm rounded-circle ms-2" @click="cambiarDia(1)">
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="citas.length === 0" class="text-center py-5 bg-white rounded-4 border-dashed">
      <div class="mb-3 text-muted opacity-50">
        <i class="mdi mdi-calendar-check" style="font-size: 3rem"></i>
      </div>
      <h5>{{ $t('appointments.no_appointments_title') }}</h5>
      <p class="text-muted small">{{ $t('appointments.no_appointments_desc') }}</p>
    </div>

    <div v-else class="row g-3">
      <div class="col-12" v-for="cita in citas" :key="cita.citaId">
        <div class="card border-0 shadow-sm appointment-row">
          <div class="card-body d-flex align-items-center p-3">
            <div class="time-box text-center me-4">
              <div class="fw-bold text-dark fs-5">{{ formatTime(cita.fechaHoraInicio) }}</div>
              <small class="text-muted">
                {{ getDuration(cita) }} {{ $t('appointments.minutes_abbr') }}
              </small>
            </div>

            <div class="vr me-4" style="height: 40px; opacity: 0.2"></div>

            <div class="flex-grow-1">
              <h5 class="fw-bold mb-1 text-primary">{{ cita.nombrePaciente }}</h5>
              <div class="d-flex align-items-center gap-3 text-muted small">
                <span>
                  <i class="mdi mdi-clock-outline me-1"></i>
                  {{ $t('appointments.until') }} {{ formatTime(cita.fechaHoraFin) }}
                </span>
                <span class="badge bg-light text-dark border">
                  {{ $t('status.' + cita.estado) }}
                </span>
              </div>
            </div>

            <div>
              <button
                class="btn btn-light btn-icon text-primary"
                :title="$t('appointments.view_clinical_history')"
              >
                <i class="mdi mdi-file-document-outline"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import citasService, { type CitaMedicoResponse } from '@/services/citasService'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
const citas = ref<CitaMedicoResponse[]>([])
const loading = ref(false)

onMounted(() => {
  cargarAgenda()
})

async function cargarAgenda() {
  loading.value = true
  try {
    citas.value = await citasService.getAgendaMedico(fechaSeleccionada.value)
  } catch (error) {
    console.error('Error cargando agenda', error)
  } finally {
    loading.value = false
  }
}

function cambiarDia(dias: number) {
  const [yearStr, monthStr, dayStr] = fechaSeleccionada.value.split('-')
  const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr))

  date.setDate(date.getDate() + dias)

  const newYear = date.getFullYear()
  const newMonth = String(date.getMonth() + 1).padStart(2, '0')
  const newDay = String(date.getDate()).padStart(2, '0')

  fechaSeleccionada.value = `${newYear}-${newMonth}-${newDay}`

  cargarAgenda()
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getDuration(cita: CitaMedicoResponse) {
  const start = new Date(cita.fechaHoraInicio).getTime()
  const end = new Date(cita.fechaHoraFin).getTime()
  return Math.round((end - start) / 60000)
}
</script>

<style scoped lang="scss">
@use 'sass:color';
$primary: #006655;

.border-dashed {
  border: 2px dashed #dee2e6;
}

.time-box {
  min-width: 80px;
}

.appointment-row {
  border-left: 4px solid $primary !important;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    background-color: color.adjust($primary, $lightness: 55%);
    color: $primary;
  }
}
</style>
