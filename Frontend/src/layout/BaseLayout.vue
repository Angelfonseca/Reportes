<template>
  <div class="layout">
    <Navbar />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup>

import Navbar from '../components/Navbar.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
}

.content {
  margin-left: 250px; /* Deja espacio para el sidebar */
  padding: 20px;
  flex: 1;
}

/* Ajusta el diseño para móviles */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .content {
    margin-left: 0;
    width: 100%;
  }
}
</style>