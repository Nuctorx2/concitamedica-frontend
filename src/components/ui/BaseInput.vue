<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-bold text-secondary" v-if="label">
      {{ label }}
    </label>

    <div class="input-group has-validation">
      <span v-if="icon" class="input-group-text bg-light border-end-0">
        <i :class="`mdi ${icon}`"></i>
      </span>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="form-control py-2"
        :class="{ 'is-invalid': error, 'border-start-0': icon }"
        :placeholder="placeholder"
        v-bind="$attrs"
      />

      <div class="invalid-feedback" v-if="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  modelValue: string | number
  type?: string
  placeholder?: string
  error?: string
  icon?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.form-control:focus {
  box-shadow: none;
  border-color: var(--color-primary, #006655);
}
.input-group-text {
  color: #6c757d;
}
</style>
