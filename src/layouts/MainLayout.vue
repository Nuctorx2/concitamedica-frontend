<template>
  <div class="layout-container">
    <AppSidebar />

    <main class="content flex-grow-1 p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 👇 Aseguramos que importamos el archivo con el nuevo nombre
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<style scoped lang="scss">
$background: #f5f5f5;

.layout-container {
  height: 100vh;
  display: flex; /* Obligatorio para que se pongan lado a lado */
  overflow: hidden;
}

.content {
  background: $background;
  overflow-y: auto;
  width: 100%;
  position: relative; /* Ayuda a posicionar elementos internos */
}
</style>
