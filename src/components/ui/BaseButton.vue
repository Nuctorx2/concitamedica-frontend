<template>
  <button
    class="btn w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
    :class="[`btn-${variant}`, { disabled: loading }]"
    :disabled="loading || disabled"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    <span v-else> <slot></slot> </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary'
  }>(),
  {
    loading: false,
    disabled: false,
    variant: 'primary',
  },
)
</script>

<style scoped lang="scss">
@use 'sass:color';

.btn-primary {
  background-color: #006655;
  border-color: #006655;
  color: white;

  &:hover {
    background-color: color.adjust(#006655, $lightness: -5%);
  }
}
</style>
