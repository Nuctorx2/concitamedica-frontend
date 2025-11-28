<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <RouterLink :to="{ name: 'medicos' }" class="text-decoration-none text-muted small">
              <i class="mdi mdi-arrow-left"></i> {{ $t('medicos.back_to_directory') }}
            </RouterLink>

            <h3 class="fw-bold text-dark mt-1">{{ $t('schedules.title') }}</h3>
            <p class="text-muted mb-0" v-if="medicoNombre">
              {{ $t('schedules.subtitle') }} <strong>{{ medicoNombre }}</strong>
            </p>
          </div>

          <button class="btn btn-primary" @click="guardarCambios" :disabled="store.loading">
            <span v-if="store.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ store.loading ? $t('schedules.saving') : $t('schedules.btn_save') }}
          </button>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <i class="mdi mdi-alert-circle me-2"></i> {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="alert alert-success">
          <i class="mdi mdi-check-circle me-2"></i> {{ successMsg }}
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-0">
            <div v-if="cargandoInicial" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-4 py-3">{{ $t('schedules.table_day') }}</th>
                    <th class="text-center">{{ $t('schedules.table_status') }}</th>
                    <th>{{ $t('schedules.table_start') }}</th>
                    <th>{{ $t('schedules.table_end') }}</th>
                    <th class="pe-4 text-end">{{ $t('schedules.table_actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(dia, index) in agendaSemanal"
                    :key="dia.value"
                    :class="{ 'bg-light-subtle': !dia.activo }"
                  >
                    <td class="ps-4 fw-bold text-secondary">
                      {{ $t('schedules.days.' + dia.value) }}
                    </td>

                    <td class="text-center">
                      <div class="form-check form-switch d-inline-block">
                        <input class="form-check-input" type="checkbox" v-model="dia.activo" />
                      </div>
                    </td>

                    <td>
                      <input
                        type="time"
                        class="form-control"
                        v-model="dia.inicio"
                        :disabled="!dia.activo"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        class="form-control"
                        v-model="dia.fin"
                        :disabled="!dia.activo"
                      />
                    </td>

                    <td class="pe-4 text-end">
                      <button
                        class="btn btn-sm btn-link text-decoration-none text-muted"
                        @click="copiarAlSiguiente(index)"
                        :title="$t('schedules.copy_next')"
                        v-if="index < 6 && dia.activo"
                      >
                        <i class="mdi mdi-content-copy"></i> {{ $t('schedules.copy_next') }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer bg-white p-3 text-center">
            <small class="text-muted">
              <i class="mdi mdi-information-outline"></i>
              {{ $t('schedules.footer_note') }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHorariosStore } from '@/store/horarios'
import { useMedicosStore } from '@/store/medicos'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useHorariosStore()
const medicosStore = useMedicosStore()
const { t } = useI18n()

const medicoId = Number(route.params.id)
const medicoNombre = ref('')
const cargandoInicial = ref(true)
const errorMsg = ref('')
const successMsg = ref('')

interface DiaForm {
  value: string
  activo: boolean
  inicio: string
  fin: string
}

const diasBase = [
  { value: 'LUNES' },
  { value: 'MARTES' },
  { value: 'MIERCOLES' },
  { value: 'JUEVES' },
  { value: 'VIERNES' },
  { value: 'SABADO' },
  { value: 'DOMINGO' },
]

const agendaSemanal = reactive<DiaForm[]>([])

onMounted(async () => {
  try {
    if (!medicosStore.medicos.length) await medicosStore.fetchMedicos()
    const medico = medicosStore.medicos.find((m) => m.id === medicoId)
    medicoNombre.value = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico'

    await store.fetchHorarios(medicoId)

    inicializarFormulario()
  } catch (e) {
    errorMsg.value = t('schedules.error_load')
  } finally {
    cargandoInicial.value = false
  }
})

function inicializarFormulario() {
  diasBase.forEach((diaBase) => {
    const horarioExistente = store.horarios.find((h) => h.diaSemana === diaBase.value)
    agendaSemanal.push({
      value: diaBase.value,
      activo: !!horarioExistente,
      inicio: horarioExistente ? recortarSegundos(horarioExistente.horaInicio) : '08:00',
      fin: horarioExistente ? recortarSegundos(horarioExistente.horaFin) : '17:00',
    })
  })
}

function recortarSegundos(hora: string) {
  // Backend envía "08:00:00", Input time necesita "08:00"
  return hora.substring(0, 5)
}

function copiarAlSiguiente(idx: number) {
  const actual = agendaSemanal[idx]
  const siguiente = agendaSemanal[idx + 1]
  siguiente.activo = true
  siguiente.inicio = actual.inicio
  siguiente.fin = actual.fin
}

async function guardarCambios() {
  errorMsg.value = ''
  successMsg.value = ''

  const payload = agendaSemanal
    .filter((d) => d.activo)
    .map((d) => ({
      diaSemana: d.value,
      horaInicio: `${d.inicio}:00`,
      horaFin: `${d.fin}:00`,
    }))

  for (const h of payload) {
    if (h.horaInicio >= h.horaFin) {
      errorMsg.value = t('schedules.error_time')
      return
    }
  }

  try {
    await store.guardarHorarios(medicoId, payload)
    successMsg.value = t('schedules.success_save')
    setTimeout(() => (successMsg.value = ''), 3000)
  } catch (e: any) {
    errorMsg.value = store.error || t('schedules.error_save')
  }
}
</script>

<style scoped>
.bg-light-subtle {
  background-color: #f8f9fa;
  opacity: 0.6;
}
</style>
