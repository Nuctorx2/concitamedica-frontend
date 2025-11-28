<template>
  <div class="container-fluid">
    <h3 class="fw-bold mb-4">{{ $t('dashboard.admin_citas_title') }}</h3>

    <button
      class="btn btn-outline-danger me-2"
      @click="descargarReporte"
      :title="$t('medicosList.header.btnReportTooltip')"
    >
      <i class="mdi mdi-file-pdf-box"></i> {{ $t('common.btn_report') }}
    </button>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">{{ $t('common.id') }}</th>
                <th>{{ $t('common.date_time') }}</th>
                <th>{{ $t('common.patient') }}</th>
                <th>{{ $t('common.doctor') }}</th>
                <th>{{ $t('common.specialty') }}</th>
                <th>{{ $t('common.status') }}</th>
                <th class="text-end pe-4">{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in store.misCitas" :key="cita.id">
                <td class="ps-4 fw-bold text-muted">#{{ cita.id }}</td>
                <td>
                  <div class="fw-bold">{{ formatDate(cita.fechaHoraInicio) }}</div>
                  <div class="small text-muted">{{ formatTime(cita.fechaHoraInicio) }}</div>
                </td>

                <td>
                  <div class="fw-bold text-dark">{{ cita.nombrePaciente }}</div>
                  <div class="small text-muted">{{ $t('common.id') }}: {{ cita.pacienteId }}</div>
                </td>
                <td>
                  <div class="fw-bold">{{ cita.nombreMedico }}</div>
                  <div class="small text-muted">{{ $t('common.id') }}: {{ cita.medicoId }}</div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">{{ cita.especialidad }}</span>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(cita.estado)">
                    {{ $t(`status.${cita.estado}`) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <button
                    v-if="cita.estado === 'AGENDADA'"
                    class="btn btn-sm btn-outline-danger"
                    @click="cancelar(cita.id)"
                    :title="$t('dashboard.btn_cancel_appointment')"
                  >
                    <i class="mdi mdi-cancel"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiClient from '@/services/apiClient'
import { onMounted } from 'vue'
import { useCitasStore } from '@/store/citas'
import { useI18n } from 'vue-i18n'

const store = useCitasStore()
const { t } = useI18n()

onMounted(() => {
  store.fetchTodasLasCitas()
})

function cancelar(id: number) {
  if (confirm(t('dashboard.admin_citas_confirm_cancel'))) {
    store.cancelarCitaAdmin(id)
  }
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const getStatusClass = (status: string) => {
  if (status === 'AGENDADA') return 'bg-success text-white'
  if (status.includes('CANCELADA')) return 'bg-danger text-white'
  return 'bg-secondary text-white'
}

async function descargarReporte() {
  try {
    const response = await apiClient.get('/admin/reportes/citas', {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Citas_reporte.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    alert(t('medicosList.messages.errorReport'))
  }
}
</script>
