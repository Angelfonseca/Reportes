<template>
  <div>
    <nav class="sidebar" :class="{ 'sidebar-hidden': !showSidebar }">
      <div class="logo flex justify-center items-center">
        <!-- Imagen del usuario con fotografía dinámica -->
        <img class="object-cover rounded-full h-21 w-24 mx-auto my-4" :src="userPhoto" alt="User photo">
        <span class="col ml-4"></span>
      </div>
      <div class="links">
        <router-link to="/consulta" class="link">Consulta de reportes</router-link>
        <router-link to="/reporte" class="link">Generar reporte</router-link>
        <router-link to="/subir" class="link">Subir alumnos</router-link>
        <router-link to="/modificar" class="link">Modificar alumno</router-link>
        <button @click="toggleSidebar" class="toggle-button">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="$router.push('/')" class="link" id="cerrar">
          <svg class="h-7 w-7" fill="none" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Cerrar sesión
        </button>
      </div>
      <div class="LogoContainer"> 
        <img class="object-cover h-21 w-30" src="/navlogo.png">
      </div>
    </nav>
    <button @click="toggleSidebar" class="toggle-button-collapsed" :class="{ 'button-visible': !showSidebar }">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { url } from '../services/api.config';

const showSidebar = ref(true);
const user = JSON.parse(localStorage.getItem('user')); // Obtener usuario desde localStorage
const userPhoto = ref('../../public/userIcon.png'); // Valor por defecto

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

// Cambiar la imagen del usuario si tiene una fotografía específica
onMounted(() => {
  if (user) {
    console.log("User loaded:", user);

    if (user.user.fotografia) {
      const cleanPath = user.user.fotografia.replace(/\\/g, '/');
      userPhoto.value = url + cleanPath;
      console.log("User photo URL:", userPhoto.value);  // Ver la URL generada en consola
    } else {
      console.log("No user photo found.");
    }
  } else {
    console.log("No user found in localStorage.");
  }
});

</script>

<style>
@import '../assets/componentscss/Navbar.css'; 
</style>
