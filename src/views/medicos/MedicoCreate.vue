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
            <h4 class="fw-bold mb-4 text-primary">{{ $t('medicos.create_title') }}</h4>

            <form @submit.prevent="handleSubmit">
              <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                {{ $t('medicos.create_subtitle') }}
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">
                    {{ $t('medicos.specialty_required') }} <span class="text-danger">*</span>
                  </label>
                  <select class="form-select py-2" v-model="form.especialidadId" required>
                    <option :value="null" disabled>{{ $t('medicos.select_specialty') }}</option>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="email"
                    :label="$t('medicos.institutional_email')"
                    v-model="form.email"
                    type="email"
                    icon="mdi-email"
                    required
                    :title="$t('auth.email_placeholder')"
                  />
                </div>
                <div class="col-md-6">
                  <BaseInput
                    id="password"
                    :label="$t('medicos.temp_password')"
                    v-model="form.password"
                    type="password"
                    icon="mdi-lock"
                    required
                    minlength="5"
                    maxlength="50"
                    :message="$t('auth.help_password_min')"
                  />
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
                    icon="mdi-card-account-details"
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
                  <label class="form-label fw-bold text-secondary">
                    {{ $t('auth.gender') }} <span class="text-danger">*</span>
                  </label>
                  <select class="form-select py-2" v-model="form.genero" required>
                    <option value="" disabled>{{ $t('common.select_placeholder') }}</option>
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
                    icon="mdi-phone"
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
                    icon="mdi-map-marker"
                    required
                    minlength="5"
                    maxlength="100"
                    :title="$t('auth.placeholder_address')"
                  />
                </div>
              </div>

              <div v-if="errorMsg" class="alert alert-danger mb-3">
                <i class="mdi mdi-alert-circle"></i> {{ errorMsg }}
              </div>

              <div class="d-flex gap-3">
                <RouterLink :to="{ name: 'medicos' }" class="btn btn-light flex-grow-1">
                  {{ $t('common.cancel_btn') }}
                </RouterLink>
                <BaseButton type="submit" :loading="loading" class="flex-grow-1">
                  {{ $t('medicos.btn_hire') }}
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
import { useRouter } from 'vue-router'
import { useMedicosStore } from '@/store/medicos'
import especialidadesService, { type Especialidad } from '@/services/especialidadesService'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useMedicosStore()
const { t } = useI18n()

const loading = ref(false)
const errorMsg = ref('')
const especialidades = ref<Especialidad[]>([])

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  especialidadId: null as number | null,
})

onMounted(async () => {
  try {
    especialidades.value = await especialidadesService.getAll()
  } catch (e) {
    errorMsg.value = t('medicos.error_load_specialties')
  }
})

async function handleSubmit() {
  if (!form.especialidadId) {
    errorMsg.value = t('medicos.error_select_specialty')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await store.crearMedico({
      ...form,
      especialidadId: form.especialidadId!,
    })

    alert(t('medicos.success_create'))
    router.push({ name: 'medicos' })
  } catch (e: any) {
    if (e.response && e.response.data && e.response.data.message) {
      errorMsg.value = e.response.data.message
    } else {
      errorMsg.value = t('medicos.error_create')
    }
  } finally {
    loading.value = false
  }
}
</script>
