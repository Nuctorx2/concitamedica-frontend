<template>
  <aside class="sidebar p-3 d-flex flex-column">
    <h2 class="app-title">ConCitaMedica</h2>

    <nav class="mt-4 flex-grow-1">
      <RouterLink
        v-for="item in filteredNavigation"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        :class="{ 'router-link-active': route.path.startsWith(item.to) }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <button class="logout-btn mt-auto" @click="logout">Cerrar sesión</button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRoute, RouterLink } from 'vue-router' // RouterLink se importa para uso explícito si es necesario
import { navigation } from '@/config/navigation'

const auth = useAuthStore()
const route = useRoute() // Ahora sí se usa en el template

// 3. CORRECCIÓN DE TIPO: Cambiamos .role por .rol
// Nota: Asegúrate de que navigation.ts use los mismos strings que el backend (ej: ROLE_ADMIN)
const userRole = computed(() => auth.user?.rol || '')

const filteredNavigation = computed(() =>
  navigation.filter((item) => item.roles.includes(userRole.value)),
)

// 👇 DIAGNÓSTICO (Borrar luego)
console.log('--- DEBUG SIDEBAR ---')
console.log('Usuario en Store:', auth.user)
console.log('Rol detectado:', auth.user?.rol)
console.log('Items de navegación:', navigation)
// 👆 FIN DIAGNÓSTICO

function logout() {
  auth.logout()
}
</script>

<style scoped lang="scss">
@use 'sass:color';

$color-primary: #006655;
$color-light: #ffffff;
$color-neutral: #e8f6f4;
$color-accent: #ff5722;
$color-text-dark: #0d1b1a;
$color-text-light: #ffffff;

.sidebar {
  width: 260px;
  min-height: 100vh; // Asegura altura completa
  background-color: $color-primary;
  color: $color-text-light;
  border-right: 3px solid color.adjust($color-primary, $lightness: -10%);
  transition: all 0.3s ease;

  .app-title {
    font-size: 1.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.8); // Blanco con transparencia
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background-color: color.adjust($color-primary, $lightness: 10%);
      color: white;
      transform: translateX(5px);
    }

    &.router-link-active {
      background-color: $color-accent;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }

  .logout-btn {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.8rem;
    width: 100%;
    color: $color-light;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $color-light;
      color: $color-primary;
      border-color: $color-light;
    }
  }
}
</style>
