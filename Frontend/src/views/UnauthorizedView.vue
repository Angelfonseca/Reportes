<template>
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1 class="unauthorized-title">403 - Acceso Denegado</h1>
        <p class="unauthorized-message">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <router-link to="/consulta" class="back-home-button">Regresar al Inicio</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Unauthorized',
  };
  </script>
  
  <style scoped>
 @import '../assets/css/Unauthorized.css';
  </style>
  