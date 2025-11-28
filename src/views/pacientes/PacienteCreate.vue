<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="mb-3">
          <RouterLink :to="{ name: 'pacientes' }" class="text-decoration-none text-muted small">
            <i class="mdi mdi-arrow-left"></i> {{ $t('pacientes.create.back_to_list') }}
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4">{{ $t('pacientes.create.title') }}</h4>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput
                    id="nombre"
                    :label="$t('pacientes.create.form.name')"
                    v-model="form.nombre"
                    :placeholder="$t('pacientes.create.form.name_placeholder')"
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
                    :placeholder="$t('pacientes.create.form.surname_placeholder')"
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
                    <option value="" disabled>
                      {{ $t('pacientes.create.form.select_placeholder') }}
                    </option>
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
                    :title="$t('pacientes.create.validation.phone_help')"
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
                  />
                </div>
              </div>

              <div class="d-flex gap-3 mt-4">
                <RouterLink :to="{ name: 'pacientes' }" class="btn btn-light flex-grow-1">
                  {{ $t('pacientes.create.buttons.cancel') }}
                </RouterLink>

                <BaseButton type="submit" :loading="store.loading" class="flex-grow-1">
                  {{ $t('pacientes.create.buttons.save') }}
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePacientesStore } from '@/store/pacientes'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { PacienteCreateRequest } from '@/services/pacientesService'

const router = useRouter()
const store = usePacientesStore()

// Inicializamos con todos los campos requeridos por el Backend
const form = reactive<PacienteCreateRequest>({
  nombre: '',
  apellido: '',
  documento: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  password: '',
})

async function handleSubmit() {
  // Asignamos una contraseña temporal por defecto
  form.password = '12345678'
  // Limpiamos el teléfono si viene vacío para evitar errores
  if (!form.telefono) delete (form as any).telefono

  try {
    await store.crearPaciente(form)
    router.push({ name: 'pacientes' })
  } catch (error) {
    // El manejo de errores global (Toast/Alert) se suele hacer en el interceptor de Axios o en el Store
    console.error(error)
  }
}
</script>
