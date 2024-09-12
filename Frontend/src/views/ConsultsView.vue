<template>
  <BaseLayout>
    <h1 class="title">Consulta de alumnos</h1>
    <div class="input-container">
      <input
        type="text"
        class="identifier"
        placeholder="Ingrese el nombre o ID del alumno"
        v-model="searchQuery"
        @input="filtrarEstudiantes"
      />
      <button class="search-button" @click="consultarAlumno">Buscar</button>
    </div>

    <!-- Mostrar la lista de estudiantes filtrados -->
    <div v-if="filteredEstudiantes.length" class="results-container">
      <ul class="results-list">
        <li
          v-for="estudiante in filteredEstudiantes"
          :key="estudiante.usuario"
          @click="selectEstudiante(estudiante)"
          class="result-item"
        >
          {{ estudiante.nombre }} ({{ estudiante.usuario }})
        </li>
      </ul>
    </div>

    <!-- Mostrar el modal si se clickea el botón -->
    <PDFModal v-if="showModal" :alumno="alumno" @close="showModal = false" />
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layout/BaseLayout.vue';
import { ref } from 'vue';
import PDFModal from '../components/PDFModal.vue';
import apiService from '../services/api.service';
import { useToast } from 'vue-toast-notification';

export default {
  components: {
    BaseLayout,
    PDFModal
  },
  setup() {
    const searchQuery = ref('');
    const showModal = ref(false);
    const alumno = ref({});
    const filteredEstudiantes = ref([]);
    const $toast = useToast();

    const filtrarEstudiantes = async () => {
  try {
    if (searchQuery.value.length > 2) {
      const response = await apiService.get('/estudiantes/usernames', {
        params: { nombre: searchQuery.value },
      });
      filteredEstudiantes.value = response.filter((estudiante) => {
        const nombre = estudiante.nombre.toLowerCase();
        const usuario = estudiante.usuario.toLowerCase();
        const searchQueryLower = searchQuery.value.toLowerCase();
        return nombre.includes(searchQueryLower) || usuario.includes(searchQueryLower);
      });
    } else {
      filteredEstudiantes.value = [];
    }
  } catch (error) {
    console.error('Error al filtrar estudiantes:', error);
  }
};

    const consultarAlumno = async () => {
      if (searchQuery.value.trim() === '') {
        $toast.error('Por favor ingrese un nombre o ID de alumno.');
        return;
      }

      try {
        const response = await apiService.get(`/estudiantes/username/${searchQuery.value}`);
        if (response) {
          alumno.value = response;
          showModal.value = true;
        } else {
          alert('No se encontró el alumno.');
        }
      } catch (error) {
        console.error('Error al buscar el alumno:', error);
        alert('Hubo un error al buscar al alumno.');
      }
    };

    const selectEstudiante = (estudiante) => {
      searchQuery.value = estudiante.usuario;
      consultarAlumno();
    };

    return {
      searchQuery,
      showModal,
      alumno,
      filteredEstudiantes,
      consultarAlumno,
      filtrarEstudiantes,
      selectEstudiante
    };
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 4rem; /* Aumenta el tamaño del título */
  margin-bottom: 20px;
  font-family : Jomolhari;
}

.input-container {
  display: flex;
  flex-direction: column; /* Para que el botón esté debajo del campo de búsqueda */
  align-items: center;
  gap: 10px;
  border-radius: 15px;
}

.identifier {
  width: 100%;
  max-width: 500px; /* Ajusta el tamaño máximo del campo de búsqueda */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 1rem; /* Ajusta el tamaño del texto */
}

.search-button {
  width: 100%;
  max-width: 200px; /* Ajusta el tamaño máximo del botón */
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2E2B75;
  color: #fff;
  font-size: 1rem; /* Ajusta el tamaño del texto */
  cursor: pointer;
}

.search-button:hover {
  background-color: #2e2b75e0;
}

.results-container {
  margin-top: 20px;
}

.results-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.result-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  background-color: #f8f9fa;
}

.result-item:hover {
  background-color: #e2e6ea;
}
</style>
