<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="mb-3">
          <RouterLink :to="{ name: 'medicos' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> {{ $t('medicos.back_to_directory') }}
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold text-primary mb-0">{{ $t('medicos.edit_title') }}</h4>
              <span v-if="loading" class="spinner-border spinner-border-sm text-secondary"></span>
            </div>

            <form @submit.prevent="handleUpdate" v-if="!loading">
              <div class="row g-3 mb-4">
                <div class="col-md-12">
                  <label class="form-label fw-bold text-secondary">{{
                    $t('medicos.specialty_required')
                  }}</label>
                  <select class="form-select py-2" v-model="form.especialidadId" required>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                {{ $t('medicos.personal_data') }}
              </h6>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <BaseInput
                    id="nombre"
                    :label="$t('auth.names')"
                    v-model="form.nombre"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    :title="$t('auth.help_names')"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="apellido"
                    :label="$t('auth.surnames')"
                    v-model="form.apellido"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    :title="$t('auth.help_names')"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    :label="$t('auth.document_id')"
                    v-model="form.documento"
                    required
                    minlength="8"
                    maxlength="10"
                    pattern="[0-9]{8,10}"
                    :title="$t('auth.help_document')"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="fechaNacimiento"
                    :label="$t('auth.birthdate')"
                    v-model="form.fechaNacimiento"
                    type="date"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">{{ $t('auth.gender') }}</label>
                  <select class="form-select py-2" v-model="form.genero" required>
                    <option value="MASCULINO">{{ $t('common.gender_male') }}</option>
                    <option value="FEMENINO">{{ $t('common.gender_female') }}</option>
                    <option value="OTRO">{{ $t('common.gender_other') }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="telefono"
                    :label="$t('auth.mobile_phone')"
                    v-model="form.telefono"
                    required
                    minlength="7"
                    maxlength="15"
                    pattern="[0-9]{7,15}"
                    :title="$t('auth.help_phone')"
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    :label="$t('auth.address')"
                    v-model="form.direccion"
                    required
                    minlength="5"
                    maxlength="100"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold text-secondary">{{
                    $t('medicos.email_readonly')
                  }}</label>
                  <input type="text" class="form-control" :value="emailReadOnly" disabled />
                </div>
              </div>

              <div class="d-flex gap-3">
                <RouterLink :to="{ name: 'medicos' }" class="btn btn-light flex-grow-1">
                  {{ $t('common.cancel_btn') }}
                </RouterLink>

                <BaseButton type="submit" :loading="saving" class="flex-grow-1">
                  {{ $t('common.save_btn') }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMedicosStore } from '@/store/medicos'
import especialidadesService, { type Especialidad } from '@/services/especialidadesService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const store = useMedicosStore()
const { t } = useI18n()

const medicoId = Number(route.params.id)
const loading = ref(true)
const saving = ref(false)
const especialidades = ref<Especialidad[]>([])
const emailReadOnly = ref('')

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  especialidadId: 0,
})

onMounted(async () => {
  try {
    especialidades.value = await especialidadesService.getAll()
    await store.fetchMedicoById(medicoId)
    if (store.medicoActual) {
      const m = store.medicoActual
      form.nombre = m.nombre
      form.apellido = m.apellido
      form.documento = m.documento
      form.telefono = m.telefono
      form.direccion = m.direccion
      form.fechaNacimiento = m.fechaNacimiento
      form.genero = m.genero
      form.especialidadId = m.especialidadId
      emailReadOnly.value = m.email
    }
  } catch (e) {
    alert(t('medicos.error_load'))
    router.push({ name: 'medicos' })
  } finally {
    loading.value = false
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    await store.actualizarMedico(medicoId, form)
    alert(t('medicos.success_update'))
    router.push({ name: 'medicos' })
  } catch (e) {
    alert(t('medicos.error_update'))
  } finally {
    saving.value = false
  }
}
</script>
