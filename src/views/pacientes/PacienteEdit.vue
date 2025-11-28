<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="mb-3">
          <RouterLink :to="{ name: 'pacientes' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> {{ $t('pacientes.edit.back') }}
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold mb-0">{{ $t('pacientes.edit.title') }}</h4>
              <span
                v-if="store.loading"
                class="spinner-border spinner-border-sm text-primary"
              ></span>
            </div>

            <div v-if="store.error" class="alert alert-danger">
              {{ store.error }}
            </div>

            <form v-else @submit.prevent="handleUpdate">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput
                    id="nombre"
                    :label="$t('pacientes.create.form.name')"
                    v-model="form.nombre"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    :title="$t('pacientes.create.validation.text_chars_help')"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="apellido"
                    :label="$t('pacientes.create.form.surname')"
                    v-model="form.apellido"
                    required
                    minlength="2"
                    maxlength="40"
                    pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+"
                    :title="$t('pacientes.create.validation.text_chars_help')"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="documento"
                    :label="$t('pacientes.create.form.document')"
                    v-model="form.documento"
                    icon="mdi-card-account-details"
                    required
                    minlength="8"
                    maxlength="10"
                    pattern="[0-9]{8,10}"
                    :title="$t('pacientes.create.validation.doc_help')"
                  />
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="fechaNacimiento"
                    :label="$t('pacientes.create.form.birthdate')"
                    v-model="form.fechaNacimiento"
                    type="date"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary">
                    {{ $t('pacientes.create.form.gender') }}
                  </label>
                  <select class="form-select py-2" v-model="form.genero" required>
                    <option value="MASCULINO">{{ $t('common.gender_male') }}</option>
                    <option value="FEMENINO">{{ $t('common.gender_female') }}</option>
                    <option value="OTRO">{{ $t('common.gender_other') }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <BaseInput
                    id="telefono"
                    :label="$t('pacientes.create.form.phone')"
                    v-model="form.telefono"
                    icon="mdi-phone"
                    required
                    minlength="7"
                    maxlength="15"
                    pattern="[0-9]{7,15}"
                    :title="$t('pacientes.edit.validation.phone_help')"
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="email"
                    :label="$t('pacientes.create.form.email')"
                    v-model="form.email"
                    type="email"
                    icon="mdi-email"
                    required
                    :title="$t('pacientes.edit.validation.email_help')"
                  />
                </div>

                <div class="col-12">
                  <BaseInput
                    id="direccion"
                    :label="$t('pacientes.create.form.address')"
                    v-model="form.direccion"
                    icon="mdi-map-marker"
                    required
                    minlength="5"
                    maxlength="100"
                    :title="$t('pacientes.edit.validation.address_help')"
                  />
                </div>
              </div>

              <div class="d-flex gap-3 mt-4">
                <RouterLink :to="{ name: 'pacientes' }" class="btn btn-light flex-grow-1">
                  {{ $t('pacientes.edit.buttons.cancel') }}
                </RouterLink>
                <BaseButton type="submit" :loading="saving" class="flex-grow-1">
                  {{ $t('pacientes.edit.buttons.save_changes') }}
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacientesStore } from '@/store/pacientes'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from 'vue-i18n' // Importación necesaria

const route = useRoute()
const router = useRouter()
const store = usePacientesStore()
const { t } = useI18n() // Hook para traducciones en JS

const saving = ref(false)
const pacienteId = Number(route.params.id)

const form = reactive({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
})

onMounted(async () => {
  await store.fetchPacienteById(pacienteId)

  if (store.pacienteActual) {
    const p = store.pacienteActual
    form.nombre = p.nombre
    form.apellido = p.apellido
    form.documento = p.documento
    form.email = p.email
    form.telefono = p.telefono
    form.direccion = p.direccion
    form.fechaNacimiento = p.fechaNacimiento
    form.genero = p.genero || 'OTRO'
  }
})

async function handleUpdate() {
  saving.value = true
  try {
    await store.actualizarPaciente(pacienteId, form)
    // Mensaje de éxito traducido
    alert(t('pacientes.edit.messages.success_update'))
    router.push({ name: 'pacientes' })
  } catch (error) {
    // Mensaje de error traducido
    alert(t('pacientes.edit.messages.error_update'))
  } finally {
    saving.value = false
  }
}
</script>
