<template>
  <BaseLayout>
    <h1 class="title">Consulta</h1>
    
    <!-- Input for admin to search for students -->
    <div class="input-container" v-if="user.user && user.user.isAdmin">
      <input type="text" class="identifier" placeholder="Ingrese el nombre o ID del alumno" v-model="searchQuery"
        @input="filtrarEstudiantes" />
      <ul class="results-list">
        <li v-for="estudiante in filteredEstudiantes" :key="estudiante.usuario" @click="selectEstudiante(estudiante)"
          class="result-item">
          {{ estudiante.nombre }} ({{ estudiante.usuario }})
        </li>
        <li v-if="!filteredEstudiantes.length && searchQuery.length > 2" class="result-item">No se encontraron estudiantes.</li>
      </ul>
      <button class="search-button" @click="consultarAlumno">Buscar</button>
      <br><br>
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
    </div>

    <!-- Button for non-admin users to consult their own reports -->
    <div v-else>
      <p>Consulta tus propios reportes:</p>
      <button class="search-button" @click="consultarMiReporte">Consultar Reporte</button>
    </div>
    <div v-if="filteredEstudiantes.length" class="results-container">
      <!-- Any results container can be placed here -->
    </div>
    
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
import moment from 'moment';
import {validateJWT} from '../services/auth.pages';
import { onMounted } from 'vue';
import router from '../router/index';
export default {
  components: {
    BaseLayout,
    PDFModal,
    PDFTable
  },
  setup() {
    const user = JSON.parse(localStorage.getItem('user'));
    const searchQuery = ref('');
    const startDate = ref(moment().subtract(2, 'weeks').format('YYYY-MM-DD'));
    const endDate = ref(moment().add(2, 'weeks').format('YYYY-MM-DD'));
    const showModal = ref(false);
    const alumno = ref({});
    const filteredEstudiantes = ref([]);
    const $toast = useToast();
    const reports = ref([]);
    const showReportesModal = ref(false);
    const isLoading = ref(false);

    validateJWT();
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
        console.log(response);
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

    const consultarMiReporte = async () => {
      const usuario = user.user.usuario;
      if (usuario.trim() === '') {
        $toast.error('No se encontró el usuario.');
        return;
      }

      try {
        const response = await apiService.get(`/estudiantes/username/${usuario}`);
        console.log(response);
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

      if (moment(endDate.value).isBefore(startDate.value)) {
        $toast.error('La fecha de fin debe ser posterior a la fecha de inicio.');
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

    onMounted(() => {
      if (!user.user || !user.user.cambioContrasena) {
        console.log(user.user)
        $toast.error('Es necesario cambiar la contraseña.');
        router.push('/configure');
      }
    });

    return {
      user,
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
      showReportesModal,
      consultarMiReporte
    };
  }
};
</script>

<style scoped>
@import "../assets/css/ConsultsView.css";
</style>
