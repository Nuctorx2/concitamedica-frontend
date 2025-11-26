<template>
  <aside class="sidebar p-3 d-flex flex-column">
    <h2 class="app-title">ConCitaMedica</h2>

    <nav class="mt-4 flex-grow-1">
      <RouterLink
        v-for="item in filteredNavigation"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        :class="{ 'active-nav-item': isLinkActive(item.to) }"
      >
        <i :class="`mdi ${item.icon} me-2`"></i> {{ item.label }}
      </RouterLink>
    </nav>

    <button class="logout-btn mt-auto" @click="logout">Cerrar sesión</button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRoute, RouterLink } from 'vue-router'
import { navigation } from '@/config/navigation'

const auth = useAuthStore()
const route = useRoute()

const userRole = computed(() => auth.user?.rol || '')

// Filtramos el menú según el rol
const filteredNavigation = computed(() =>
  navigation.filter((item) => item.roles.includes(userRole.value)),
)

// Resaltar el menú activo
function isLinkActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

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
  min-height: 100vh;
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
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background-color: color.adjust($color-primary, $lightness: 10%);
      color: white;
      transform: translateX(5px);
    }

    &.active-nav-item {
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
