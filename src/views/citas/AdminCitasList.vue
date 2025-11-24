<template>
  <div class="container-fluid">
    <h3 class="fw-bold mb-4">Gestión Global de Citas</h3>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">ID</th>
                <th>Fecha y Hora</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th class="text-end pe-4">Acciones</th>
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
                  <div class="small text-muted">ID: {{ cita.pacienteId }}</div>
                </td>
                <td>
                  <div class="fw-bold">{{ cita.nombreMedico }}</div>
                  <div class="small text-muted">ID: {{ cita.medicoId }}</div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">{{ cita.especialidad }}</span>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(cita.estado)">{{ cita.estado }}</span>
                </td>
                <td class="text-end pe-4">
                  <button
                    v-if="cita.estado === 'AGENDADA'"
                    class="btn btn-sm btn-outline-danger"
                    @click="cancelar(cita.id)"
                    title="Cancelar Cita"
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
import { onMounted } from 'vue'
import { useCitasStore } from '@/store/citas'

const store = useCitasStore()

onMounted(() => {
  store.fetchTodasLasCitas()
})

function cancelar(id: number) {
  if (confirm('¿Confirmas la cancelación de esta cita? El horario quedará libre.')) {
    store.cancelarCitaAdmin(id)
  }
}

// Helpers de formato
const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const getStatusClass = (status: string) => {
  if (status === 'AGENDADA') return 'bg-success text-white'
  if (status.includes('CANCELADA')) return 'bg-danger text-white'
  return 'bg-secondary text-white'
}
</script>
