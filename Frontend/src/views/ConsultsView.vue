<template>
  <BaseLayout>
    <h1 class="title">Consulta de alumnos</h1>
    <div class="input-container">
      <input type="text" class="identifier" placeholder="Ingrese el nombre o ID del alumno" v-model="searchQuery"
        @input="filtrarEstudiantes" />
        <ul class="results-list">
        <li v-for="estudiante in filteredEstudiantes" :key="estudiante.usuario" @click="selectEstudiante(estudiante)"
          class="result-item">
          {{ estudiante.nombre }} ({{ estudiante.usuario }})
        </li>
      </ul>
      <button class="search-button" @click="consultarAlumno">Buscar</button>
    </div>
    <br><br>
    <!-- Campos de fecha para filtrar por fechas -->
    <div>
      <h1 class="title">Obtener reportes por fecha</h1>
      <div class="date-filter">
        <label class="label" for="startDate">Fecha de inicio:</label>
        <input type="date" id="startDate" v-model="startDate" /> <br> <br>

        <label class="label" for="endDate">Fecha de fin:</label>
        <input type="date" id="endDate" v-model="endDate" /> <br> <br>

        <button class="search-button" @click="consultarReportesPorFechas">Obtener Reportes</button>
      </div>
    </div>
    <!-- Mostrar la lista de estudiantes filtrados -->
    <div v-if="filteredEstudiantes.length" class="results-container">
      
    </div>
    
    <!-- Mostrar el modal si se clickea el botón -->
    <PDFModal v-if="showModal" :alumno="alumno" @close="showModal = false" />
    <PDFTable v-if="showReportesModal" :reportes="reports" :startDate="startDate" :endDate="endDate" @close="showReportesModal = false" />

  </BaseLayout>
</template>

<script>
import BaseLayout from '../layout/BaseLayout.vue';
import { ref } from 'vue';
import PDFModal from '../components/PDFModal.vue';
import apiService from '../services/api.service';
import { useToast } from 'vue-toast-notification';
import PDFTable from '../components/PDFTable.vue';
export default {
  components: {
    BaseLayout,
    PDFModal,
    PDFTable
  },
  setup() {
    const searchQuery = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const showModal = ref(false);
    const alumno = ref({});
    const filteredEstudiantes = ref([]);
    const $toast = useToast();
    const reports = ref([]);
    const showReportesModal = ref(false);

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
          $toast.error('No se encontró al alumno.');
        }
      } catch (error) {
        console.error('Error al buscar el alumno:', error);
        $toast.error('Hubo un error al buscar al alumno.');
      }
    };

    const consultarReportesPorFechas = async () => {
      if (!startDate.value || !endDate.value) {
        $toast.error('Por favor seleccione ambas fechas.');
        return;
      }

      try {
        const response = await apiService.post('/reportes/dates', {
          startDate: startDate.value,
          endDate: endDate.value
        });
        console.log(response);
        if (response.length) {
          reports.value = response;
          showReportesModal.value = true;
          $toast.success('Reportes obtenidos con éxito.');
        } else {
          $toast.error('No se encontraron reportes en el rango de fechas seleccionado.');
        }
      } catch (error) {
        console.error('Error al obtener reportes:', error);
        $toast.error('Hubo un error al obtener los reportes.');
      }
    };

    const selectEstudiante = (estudiante) => {
      searchQuery.value = estudiante.usuario;
      consultarAlumno();
    };

    return {
      searchQuery,
      startDate,
      endDate,
      showModal,
      alumno,
      filteredEstudiantes,
      reports,
      consultarAlumno,
      filtrarEstudiantes,
      selectEstudiante,
      consultarReportesPorFechas,
      showReportesModal
    };
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 2.5rem;
  /* Aumenta el tamaño del título */
  margin-bottom: 20px;
  font-family: Jomolhari;
}

.input-container {
  display: flex;
  flex-direction: column;
  /* Para que el botón esté debajo del campo de búsqueda */
  align-items: center;
  gap: 10px;
  border-radius: 15px;
}

.label {
  font-size: 1.5rem;
  font-family: Jomolhari;
  display: block;
  margin-bottom: 5px;
}

.identifier {
  width: 100%;
  max-width: 500px;
  /* Ajusta el tamaño máximo del campo de búsqueda */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 1rem;
  /* Ajusta el tamaño del texto */
}

.search-button {
  width: 100%;
  max-width: 200px;
  /* Ajusta el tamaño máximo del botón */
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2E2B75;
  color: #fff;
  font-size: 1rem;
  /* Ajusta el tamaño del texto */
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

.date-filter {
  margin-top: 20px;
}

.date-filter label {
  margin-right: 10px;
}

.search-button {
  margin-left: 10px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegúrate de que el modal esté por encima del resto */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto; /* Si el contenido es muy grande, se añade scroll */
}

.pdf-table-container {
  width: 297mm;
  height: 210mm;
  margin: 0 auto;
  background-color: #fff;
  padding: 20mm;
}

.sheet {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.table {
  width: 100%;
  border-collapse: collapse;
}
</style>
