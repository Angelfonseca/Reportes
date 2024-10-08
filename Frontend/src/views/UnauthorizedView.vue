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
  .unauthorized-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
  }
  
  .unauthorized-content {
    text-align: center;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
  }
  
  .unauthorized-title {
    font-size: 2.5rem;
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .unauthorized-message {
    font-size: 1.25rem;
    color: #6c757d;
    margin-bottom: 2rem;
  }
  
  .back-home-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .back-home-button:hover {
    background-color: #0056b3;
  }
  </style>
  