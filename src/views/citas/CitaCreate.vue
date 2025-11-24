<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="fw-bold text-dark">Agendar Nueva Cita</h3>
            <p class="text-muted mb-0">Sigue los pasos para reservar tu consulta.</p>
          </div>
          <RouterLink :to="{ name: 'citas' }" class="btn btn-light text-muted">
            <i class="mdi mdi-close"></i> Cancelar
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <div class="steps-container d-flex justify-content-between position-relative">
              <div class="progress-line"></div>

              <div class="step-item" :class="{ active: step >= 1 }">
                <div class="step-circle">1</div>
                <span class="step-label">Especialidad</span>
              </div>

              <div class="step-item" :class="{ active: step >= 2 }">
                <div class="step-circle">2</div>
                <span class="step-label">Médico</span>
              </div>

              <div class="step-item" :class="{ active: step >= 3 }">
                <div class="step-circle">3</div>
                <span class="step-label">Fecha y Hora</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-8">
            <div v-if="step === 1" class="fade-in">
              <h5 class="fw-bold mb-3 text-primary">Selecciona una Especialidad</h5>
              <div v-if="loading.specialties" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </div>
              <div v-else class="row g-3">
                <div
                  class="col-sm-6 col-md-4"
                  v-for="esp in catalogos.especialidades"
                  :key="esp.id"
                >
                  <div class="selection-card h-100" @click="selectEspecialidad(esp)">
                    <i class="mdi mdi-stethoscope icon-lg"></i>
                    <h6 class="mt-2 fw-bold">{{ esp.nombre }}</h6>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="step === 2" class="fade-in">
              <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-2 rounded-circle" @click="step = 1">
                  <i class="mdi mdi-arrow-left"></i>
                </button>
                <h5 class="fw-bold mb-0 text-primary">
                  Selecciona un Médico ({{ form.especialidadName }})
                </h5>
              </div>

              <div v-if="loading.medicos" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </div>

              <div v-else-if="catalogos.medicos.length === 0" class="alert alert-warning">
                No hay médicos disponibles para esta especialidad actualmente.
              </div>

              <div v-else class="row g-3">
                <div class="col-sm-6" v-for="med in catalogos.medicos" :key="med.id">
                  <div
                    class="selection-card d-flex align-items-center text-start p-3"
                    @click="selectMedico(med)"
                  >
                    <div class="avatar-placeholder me-3">
                      {{ med.nombre.charAt(0) }}
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">{{ med.nombre }}</h6>
                      <small class="text-muted">{{ med.email }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="step === 3" class="fade-in">
              <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-2 rounded-circle" @click="step = 2">
                  <i class="mdi mdi-arrow-left"></i>
                </button>
                <h5 class="fw-bold mb-0 text-primary">Disponibilidad del {{ form.medicoName }}</h5>
              </div>

              <div class="card border-0 shadow-sm p-3 mb-3">
                <label class="form-label fw-bold">Selecciona la Fecha</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="form.fecha"
                  :min="minDate"
                  @change="fetchSlots"
                />
              </div>

              <div v-if="form.fecha">
                <h6 class="fw-bold mb-3">Horarios Disponibles:</h6>

                <div v-if="loading.slots" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-secondary"></div>
                  Buscando huecos...
                </div>

                <div v-else-if="catalogos.slots.length === 0" class="alert alert-info small">
                  <i class="mdi mdi-information-outline"></i> No hay horarios disponibles para esta
                  fecha. Intenta otro día.
                </div>

                <div v-else class="d-flex flex-wrap gap-2">
                  <button
                    v-for="(slot, index) in catalogos.slots"
                    :key="index"
                    class="btn btn-outline-time"
                    :class="{ active: form.hora === slot.horaInicio }"
                    @click="form.hora = slot.horaInicio"
                  >
                    {{ formatTime(slot.horaInicio) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 sticky-top" style="top: 20px; z-index: 1">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3">Resumen de la Cita</h5>

                <ul class="list-unstyled mb-4">
                  <li class="mb-2 d-flex justify-content-between">
                    <span class="text-muted">Especialidad:</span>
                    <span class="fw-bold text-end">{{ form.especialidadName || '-' }}</span>
                  </li>
                  <li class="mb-2 d-flex justify-content-between">
                    <span class="text-muted">Médico:</span>
                    <span class="fw-bold text-end">{{ form.medicoName || '-' }}</span>
                  </li>
                  <li class="mb-2 d-flex justify-content-between">
                    <span class="text-muted">Fecha:</span>
                    <span class="fw-bold text-end">{{ form.fecha || '-' }}</span>
                  </li>
                  <li class="mb-2 d-flex justify-content-between">
                    <span class="text-muted">Hora:</span>
                    <span class="fw-bold text-end text-primary">{{
                      form.hora ? formatTime(form.hora) : '-'
                    }}</span>
                  </li>
                </ul>

                <div v-if="errorGeneral" class="alert alert-danger small mb-3">
                  {{ errorGeneral }}
                </div>

                <button
                  class="btn btn-primary w-100 py-2 fw-bold"
                  :disabled="!canSubmit || loading.submitting"
                  @click="confirmarCita"
                >
                  <span
                    v-if="loading.submitting"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ loading.submitting ? 'Confirmando...' : 'Confirmar Cita' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCitasStore } from '@/store/citas'
import especialidadesService, { type Especialidad } from '@/services/especialidadesService'
import medicosService, { type MedicoDTO } from '@/services/medicosService'
import citasService, { type DisponibilidadSlot } from '@/services/citasService'

const router = useRouter()
const citasStore = useCitasStore()

// --- Estado ---
const step = ref(1)
const errorGeneral = ref('')
const minDate = new Date().toISOString().split('T')[0] // Fecha mínima: Hoy

const loading = reactive({
  specialties: false,
  medicos: false,
  slots: false,
  submitting: false,
})

const catalogos = reactive({
  especialidades: [] as Especialidad[],
  medicos: [] as MedicoDTO[],
  slots: [] as DisponibilidadSlot[],
})

const form = reactive({
  especialidadId: null as number | null,
  especialidadName: '',
  medicoId: null as number | null,
  medicoName: '',
  fecha: '',
  hora: '',
})

// --- Computed ---
const canSubmit = computed(() => {
  return form.medicoId && form.fecha && form.hora
})

// --- Ciclo de Vida ---
onMounted(async () => {
  await cargarEspecialidades()
})

// --- Métodos de Lógica ---

async function cargarEspecialidades() {
  loading.specialties = true
  try {
    catalogos.especialidades = await especialidadesService.getAll()
  } catch (e) {
    errorGeneral.value = 'Error al cargar especialidades.'
  } finally {
    loading.specialties = false
  }
}

async function selectEspecialidad(esp: Especialidad) {
  form.especialidadId = esp.id
  form.especialidadName = esp.nombre
  // Resetear siguientes pasos
  form.medicoId = null
  form.medicoName = ''
  form.fecha = ''
  form.hora = ''
  catalogos.medicos = []

  step.value = 2

  // Cargar médicos
  loading.medicos = true
  try {
    catalogos.medicos = await medicosService.buscarPorEspecialidad(esp.id)
  } catch (e) {
    errorGeneral.value = 'Error cargando médicos'
  } finally {
    loading.medicos = false
  }
}

function selectMedico(med: MedicoDTO) {
  form.medicoId = med.id
  form.medicoName = med.nombre
  // Resetear fecha y hora
  form.fecha = ''
  form.hora = ''
  catalogos.slots = []

  step.value = 3
}

async function fetchSlots() {
  if (!form.medicoId || !form.fecha) return

  form.hora = '' // Resetear hora seleccionada
  loading.slots = true
  try {
    catalogos.slots = await citasService.getDisponibilidad(form.medicoId, form.fecha)
  } catch (e) {
    console.error(e)
    // No mostramos error global, solo se ve lista vacía
  } finally {
    loading.slots = false
  }
}

async function confirmarCita() {
  // 1. Guard Clause: Programación defensiva
  // Evita envíos si el formulario no está listo o si ya se está enviando (doble clic)
  if (!canSubmit.value || loading.submitting) return

  // 2. Preparar UI
  loading.submitting = true
  errorGeneral.value = ''

  try {
    // 3. Sanitización de Datos
    // Aseguramos formato HH:mm:ss (Backend espera LocalTime)
    // Si form.hora es "09:00", lo convertimos a "09:00:00"
    const horaLimpia = form.hora.length === 5 ? `${form.hora}:00` : form.hora

    // Construimos formato ISO estricto: YYYY-MM-DDTHH:mm:ss
    const fechaHoraISO = `${form.fecha}T${horaLimpia}`

    console.log('📤 Enviando cita:', { medico: form.medicoId, fecha: fechaHoraISO })

    // 4. Llamada al Store (API)
    await citasStore.agendarNuevaCita(form.medicoId!, fechaHoraISO)

    // 5. Éxito
    // Idealmente usaríamos un Toast/Notification aquí, pero el alert cumple por ahora.
    // Usamos un pequeño timeout para dar feedback visual antes de cambiar de página.
    setTimeout(async () => {
      alert('¡Cita agendada con éxito!')
      await router.push({ name: 'citas' })
    }, 100)
  } catch (e: any) {
    console.error('❌ Error al agendar:', e)

    // 6. Manejo de Errores Jerárquico
    const backendMessage = e.response?.data?.message
    const statusCode = e.response?.status

    // Nivel 1: Mensaje de Negocio del Backend (El más valioso)
    // Ej: "Ya tienes una cita de Medicina General..."
    if (backendMessage) {
      errorGeneral.value = backendMessage
    }
    // Nivel 2: Error de Conflicto Genérico (Si el backend no mandó mensaje)
    else if (statusCode === 409) {
      errorGeneral.value =
        'El horario seleccionado ya no está disponible o existe un conflicto con tu agenda.'
    }
    // Nivel 3: Errores de Validación (Datos mal formados)
    else if (statusCode === 400) {
      errorGeneral.value = 'Ocurrió un error con los datos enviados. Por favor recarga la página.'
    }
    // Nivel 4: Error de Servidor o Conexión
    else {
      errorGeneral.value = 'Ocurrió un error inesperado. Por favor intenta nuevamente más tarde.'
    }

    // 7. Reactividad ante Conflictos
    // Si el error fue por disponibilidad (409), refrescamos los slots automáticamente
    // para que el usuario vea qué horas quedan libres realmente.
    if (statusCode === 409) {
      await fetchSlots()
      form.hora = '' // Desmarcamos la hora inválida
    }
  } finally {
    // 8. Limpieza siempre, pase lo que pase
    loading.submitting = false
  }
}

// Helper para mostrar hora bonita (09:00:00 -> 09:00 AM)
function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}
</script>

<style scoped lang="scss">
@use 'sass:color';

$primary: #006655;
$neutral: #e8f6f4;

// --- Estilos del Wizard (Pasos) ---
.steps-container {
  padding: 0 20px;
}

.progress-line {
  position: absolute;
  top: 15px;
  left: 40px;
  right: 40px;
  height: 2px;
  background-color: #e9ecef;
  z-index: 0;
}

.step-item {
  position: relative;
  z-index: 1;
  text-align: center;
  opacity: 0.5;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    .step-circle {
      background-color: $primary;
      color: white;
      transform: scale(1.1);
    }
    .step-label {
      font-weight: bold;
      color: $primary;
    }
  }
}

.step-circle {
  width: 32px;
  height: 32px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 5px;
  font-weight: bold;
  color: #6c757d;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.85rem;
}

// --- Tarjetas de Selección ---
.selection-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $primary;
    background-color: color.adjust($neutral, $lightness: 2%);
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .icon-lg {
    font-size: 2.5rem;
    color: $primary;
  }
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  background-color: $neutral;
  color: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

// --- Botones de Hora ---
.btn-outline-time {
  border: 1px solid #dee2e6;
  color: #495057;
  min-width: 100px;

  &:hover {
    border-color: $primary;
    color: $primary;
    background-color: $neutral;
  }

  &.active {
    background-color: $primary;
    color: white;
    border-color: $primary;
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
