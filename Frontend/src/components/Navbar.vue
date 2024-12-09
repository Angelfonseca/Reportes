<template>
  <div>
    <nav class="sidebar" :class="{ 'sidebar-hidden': !showSidebar }">
      <div class="logo flex justify-center items-center">
        <img class="object-cover rounded-full h-21 w-24 mx-auto my-4" :src="userPhoto" alt="User photo">
        <span class="col ml-4"></span>
      </div>
      <div class="links">
        <router-link v-if="user.user && !user.user.nonAdmin" to="/consulta" class="link">Consulta de reportes</router-link>
        
        <!-- Desplegable para enlaces de administración -->
        <details class="admin-dropdown" v-if="user.user && user.user.isAdmin === true">
          <summary class="link">Administración</summary>
          <router-link class="sub_link"  to="/reporte">Generar reporte</router-link>
          <router-link class="sub_link" to="/subir" >Subir alumnos</router-link>
          <router-link class="sub_link" to="/modificar" >Modificar Usuarios</router-link>
          <router-link class="sub_link" to="/maestros">Añadir docentes</router-link>
          <router-link class="sub_link" to="/cambios-masivos">Cambios Masivos</router-link>
        </details>
        <router-link class="link" v-if="user.user && user.user.nonAdmin" to="/reporte">Generar reporte</router-link>
        <!-- Enlace para configurar el usuario -->
        <router-link to="/configure" class="link config-user">
          Usuario
        </router-link>

        <button @click="toggleSidebar" class="toggle-button">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="logout" class="link" id="cerrar">
          <svg class="h-7 w-7" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
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
const user = JSON.parse(localStorage.getItem('user'));
const userPhoto = ref('../../public/userIcon.png');

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/';
}

onMounted(() => {
  if (user) {
    if (user.user.fotografia) {
      const path = user.user.fotografia;
      userPhoto.value = path; 
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

.config-user {
  margin-top: 20px;
}


.admin-dropdown summary {
  cursor: pointer;

  margin-top: 10px;
}

.admin-dropdown[open] summary {
  color: #4CAF50; 
}

.sub_link {
  margin-left: 20px;
  display: block;
  padding: 5px 0;
  position: relative;
  color: #e2dddd;
  text-decoration: none;
}

.sub_link::before {
  content: '>';
  position: absolute;
  left: -15px;
  color: #4CAF50;
}

.sub_link:hover {
  color: #4CAF50;
  text-decoration: underline;
}

</style>
