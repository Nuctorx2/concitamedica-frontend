<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <RouterLink :to="{ name: 'medicos' }" class="text-decoration-none text-muted small">
              <i class="mdi mdi-arrow-left"></i> Volver al directorio
            </RouterLink>
            <h3 class="fw-bold text-dark mt-1">Gestión de Horarios</h3>
            <p class="text-muted mb-0" v-if="medicoNombre">
              Configurando agenda para: <strong>{{ medicoNombre }}</strong>
            </p>
          </div>
          <button class="btn btn-primary" @click="guardarCambios" :disabled="store.loading">
            <span v-if="store.loading" class="spinner-border spinner-border-sm me-2"></span>
            Guardar Cambios
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
                    <th class="ps-4 py-3">Día</th>
                    <th class="text-center">Estado</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                    <th class="pe-4 text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(dia, index) in agendaSemanal"
                    :key="dia.value"
                    :class="{ 'bg-light-subtle': !dia.activo }"
                  >
                    <td class="ps-4 fw-bold text-secondary">
                      {{ dia.label }}
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
                        title="Copiar horario al día siguiente"
                        v-if="index < 6 && dia.activo"
                      >
                        <i class="mdi mdi-content-copy"></i> Copiar al sgte.
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
              Los días desmarcados se guardarán como "No laborables".
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
import { useMedicosStore } from '@/store/medicos' // Para sacar el nombre del médico

const route = useRoute()
const store = useHorariosStore()
const medicosStore = useMedicosStore()

const medicoId = Number(route.params.id)
const medicoNombre = ref('')
const cargandoInicial = ref(true)
const errorMsg = ref('')
const successMsg = ref('')

// Estructura local para manipular el formulario
interface DiaForm {
  label: string
  value: string // "LUNES", "MARTES"...
  activo: boolean
  inicio: string
  fin: string
}

// Inicializamos la semana vacía
const diasBase = [
  { label: 'Lunes', value: 'LUNES' },
  { label: 'Martes', value: 'MARTES' },
  { label: 'Miércoles', value: 'MIERCOLES' },
  { label: 'Jueves', value: 'JUEVES' },
  { label: 'Viernes', value: 'VIERNES' },
  { label: 'Sábado', value: 'SABADO' },
  { label: 'Domingo', value: 'DOMINGO' },
]

const agendaSemanal = reactive<DiaForm[]>([])

onMounted(async () => {
  try {
    // 1. Obtener nombre del médico (si ya está en store o fetch)
    if (!medicosStore.medicos.length) await medicosStore.fetchMedicos()
    const medico = medicosStore.medicos.find((m) => m.id === medicoId)
    medicoNombre.value = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico'

    // 2. Cargar horarios existentes
    await store.fetchHorarios(medicoId)

    // 3. Mapear respuesta del backend a nuestra estructura local
    inicializarFormulario()
  } catch (e) {
    errorMsg.value = 'Error al cargar la información.'
  } finally {
    cargandoInicial.value = false
  }
})

function inicializarFormulario() {
  // Recorremos los 7 días base y buscamos si el médico ya tiene horario ese día
  diasBase.forEach((diaBase) => {
    const horarioExistente = store.horarios.find((h) => h.diaSemana === diaBase.value)

    agendaSemanal.push({
      label: diaBase.label,
      value: diaBase.value,
      activo: !!horarioExistente, // Si existe, está activo
      // Si existe usamos su hora, si no, ponemos default 08:00 - 17:00
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

  // 1. Convertir formulario a DTO
  // Solo enviamos los días marcados como "activos"
  const payload = agendaSemanal
    .filter((d) => d.activo)
    .map((d) => ({
      diaSemana: d.value,
      horaInicio: `${d.inicio}:00`, // Agregamos segundos para Java LocalTime
      horaFin: `${d.fin}:00`,
    }))

  // 2. Validaciones básicas frontend
  for (const h of payload) {
    if (h.horaInicio >= h.horaFin) {
      errorMsg.value = 'Error: La hora de inicio debe ser menor a la hora fin.'
      return
    }
  }

  // 3. Enviar
  try {
    await store.guardarHorarios(medicoId, payload)
    successMsg.value = 'Horarios actualizados correctamente.'
    setTimeout(() => (successMsg.value = ''), 3000)
  } catch (e: any) {
    // El store ya captura el mensaje del backend, lo mostramos aquí
    errorMsg.value = store.error || 'Error al guardar.'
  }
}
</script>

<style scoped>
.bg-light-subtle {
  background-color: #f8f9fa;
  opacity: 0.6;
}
</style>
