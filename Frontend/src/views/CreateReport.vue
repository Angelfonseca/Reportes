<template>
  <BaseLayout>
    <div class="report-container">
      <h1 class="title">Generar reporte</h1>

      <!-- Formulario para generar reporte -->
      <div class="form-container">
        <form @submit.prevent="generarReporte">
          <div class="form-group">
            <label for="nombreEstudiante" class="label">Nombre del estudiante:</label>
            <input
              type="text"
              id="nombreEstudiante"
              v-model="searchQuery"
              @input="filtrarEstudiantes"
              class="form-control"
              placeholder="Buscar estudiante..."
            />
            <!-- Lista de sugerencias filtradas -->
            <ul v-if="estudiantesFiltrados.length" class="suggestions">
              <li
                v-for="(estudiante, index) in estudiantesFiltrados"
                :key="index"
                @click="seleccionarEstudiante(estudiante)"
                class="suggestion-item"
              >
                {{ estudiante.nombre }}
              </li>
            </ul>
          </div>

          <!-- Display selected student name -->
          <div class="form-group" v-if="nombreEstudiante">
            <label for="nombreSeleccionado" class="label">Estudiante seleccionado:</label>
            <input
              type="text"
              id="nombreSeleccionado"
              v-model="nombreEstudiante"
              class="form-control"
              readonly
            />
          </div>

          <div class="form-group">
            <label for="razonReporte" class="label">Razón del reporte:</label>
            <textarea
              id="razonReporte"
              v-model="razonReporte"
              class="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label for="puntos" class="label">Valor en puntos</label>
            <input
              type="number"
              id="puntos"
              v-model="puntos"
              class="form-control"
              required
            />
          </div> 
          <div class="form-group">
            <label for="clase" class="label">Clase:</label>
            <input
              type="text"
              id="clase"
              v-model="clase"
              class="form-control"
              required
            />
          </div>
          <!-- Botón para enviar el formulario -->
          <button type="submit" class="submit-button">
            Generar reporte
          </button>
        </form>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import apiService from '../services/api.service';
import BaseLayout from '../layout/BaseLayout.vue';

const searchQuery = ref('');
const estudiantesFiltrados = ref([]);
const nombreEstudiante = ref('');
const razonReporte = ref('');
const clase = ref('');
let studentId = '';
const categoria = ref('Reporte');
const user = JSON.parse(localStorage.getItem('user'));
const toast = useToast();
const puntos = ref(0);
const filtrarEstudiantes = async () => {
  try {
    if (searchQuery.value.length > 2) {
      const response = await apiService.get('/estudiantes', {
        params: { nombre: searchQuery.value },
      });
      estudiantesFiltrados.value = response;
    } else {
      estudiantesFiltrados.value = [];
    }
  } catch (error) {
    console.error('Error al filtrar estudiantes:', error);
  }
};

const seleccionarEstudiante = (estudiante) => {
  console.log('Estudiante seleccionado:', estudiante.nombre);
  nombreEstudiante.value = estudiante.nombre;
  studentId = estudiante._id;
  searchQuery.value = '';
  estudiantesFiltrados.value = [];
  if (estudiante.reportes.length % 3 === 0 && estudiante.reportes.length !== 0) {
    categoria.value = 'Suspensión';
    alert('El estudiante será suspendido');
  } else {
    categoria.value = 'Reporte';
  }
  if (estudiante.puntos <= 50) {
    alert(`El estudiante tiene ${estudiante.puntos} puntos, tome las medidas necesarias`);
  }
};

const generarReporte = () => {
  console.log('valores', nombreEstudiante.value, razonReporte.value, clase.value, categoria.value, puntos.value, user.user._id, user.user.nombre
  );
  if (!nombreEstudiante.value || !razonReporte.value || !clase.value || !categoria.value || !puntos.value) {
    toast.error('Todos los campos son requeridos');
    return;
  }

  const reporte = {
    student_id: studentId,
    student_name: nombreEstudiante.value,
    reason: razonReporte.value,
    class: clase.value,
    puntos: parseInt(puntos.value),
    category: categoria.value,
    teacher_id: user.user._id,
    teacher_name: user.user.nombre,
  };

  apiService.post('/reportes', reporte)
    .then(() => {
      toast.success('Reporte generado exitosamente');
      nombreEstudiante.value = '';
      razonReporte.value = '';
      puntos.value = '';
      clase.value = '';
    })
    .then(() => {
      if (categoria.value === 'Suspensión') {
        toast.success('El estudiante ha sido suspendido');
      }
    })
    .catch((error) => {
      console.error('Error al generar reporte:', error);
      toast.error('Error al generar reporte');
    });
};
</script>

  
  <style scoped>
  .title {
    font-size: 60px;
    font-family: jomolhari;
    margin-top: 10px;
    margin-bottom: 20px; /* Add some space between the title and the form */
  }

  .report-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto; /* Center the container horizontally */
  }

  .form-container {
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .form-control {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 15px;
  }

  textarea.form-control {
    resize: vertical;
  }

  .submit-button {
    background-color: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-button:hover {
    background-color: #218838;
  }

  /* Estilos para las sugerencias */
  .suggestions {
    list-style: none;
    padding: 0;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    border-radius: 4px;
  }

  .suggestion-item {
    padding: 0.5rem;
    cursor: pointer;
  }

  .suggestion-item:hover {
    background-color: #f0f0f0;
  }

  /* Adaptación móvil */
  @media (max-width: 768px) {
    .report-container {
      padding: 1rem;
      max-width: 100%;
    }
  }
</style>