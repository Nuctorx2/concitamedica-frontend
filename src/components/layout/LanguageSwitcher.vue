<template>
  <div class="dropdown">
    <button
      class="btn btn-light btn-sm dropdown-toggle d-flex align-items-center gap-2 border"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="mdi mdi-web text-primary"></i>
      <span class="text-uppercase">{{ currentLocale }}</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
      <li>
        <a class="dropdown-item" href="#" @click.prevent="changeLanguage('es')">🇪🇸 Español</a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="changeLanguage('en')">🇺🇸 English</a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="changeLanguage('pt')">🇧🇷 Português</a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="changeLanguage('it')">🇮🇹 Italiano</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = locale

function changeLanguage(lang: string) {
  locale.value = lang
  localStorage.setItem('user-locale', lang)
}
</script>

<style scoped>
.dropdown-item:active {
  background-color: #006655;
}
</style>
