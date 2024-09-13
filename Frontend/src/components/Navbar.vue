<template>
  <div>
    <nav class="sidebar" :class="{ 'sidebar-hidden': !showSidebar }">
      <div class="logo flex justify-center items-center">
        <img class="object-cover rounded-full h-21 w-24 mx-auto my-4" id="userPic" src="../../public/userIcon.png">
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
import { ref } from 'vue';

const showSidebar = ref(true);

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}
</script>

<style scoped>
.sidebar {
  width: 250px; /* Ajusta el ancho del sidebar */
  height: 100vh; /* Ajusta la altura del sidebar */
  background-color: #2E2B75;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s;
}

.sidebar-hidden {
  transform: translateX(-250px);
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
}

.LogoContainer {
  margin-top: 15px;
  
  display: flex;
  align-items: center;
  padding: 2px;
  background-color: #ffffff;
  border-radius: 5px;
}	

.links {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra los enlaces verticalmente */
}
.link {
  color: rgb(0, 0, 0);
  text-decoration: none;
  background-color: #ffffff;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-size: 16px; /* Ajusta el tamaño de la fuente */

  text-align: center;
  justify-content: center;
}



#cerrar {
  background-color: #ffffff;
  color: #000000;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center ;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.link:hover {
  background-color: #C1D119;
}

.toggle-button {
  background-color: #ffffff;
  color: #000000;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px; /* Espacio adicional debajo del botón de alternar */

  display: flex;
  justify-content: center;
}

.toggle-button:hover {
  background-color: #e5e5e5;
}

.toggle-button-collapsed {
  position: fixed;
  top: 50%;
  left: 0;
  background-color: #c9c5c5;
  color: #000000;
  border-radius: 0 5px 5px 0;
  padding: 10px;
  cursor: pointer;
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.button-visible {
  transform: translateX(0);
}

/* Ajustes específicos para dispositivos móviles */
@media (max-width: 768px) {
  .sidebar {
    width: 200px; /* Ajusta el ancho del sidebar para dispositivos móviles */
  }

  .links {
    margin-top: 10px; /* Ajusta el margen superior para dispositivos móviles */
    margin-bottom: 10px;
  }

  .toggle-button {
    top: 10px; /* Ajusta la posición del botón de alternar en la parte superior para móviles */
  }

  #cerrar {
    bottom: 120px;
    top: 20; /* Ajusta la distancia del botón del fondo en dispositivos móviles */
  }
}

</style>
