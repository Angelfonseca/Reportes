<template>
  <BaseLayout>
    <div class="title">Agregar Estudiante</div>
    <div class="container">
      <form class="form" @submit.prevent="addStudent">
        <div class="form-row">
          <div class="form-group-left">
            <label for="nombre">Nombre del estudiante:</label>
            <input type="text" class="form-control" id="nombre" v-model="student.nombre" />
          </div>
          <div class="form-group-left">
            <label for="contrasena">Contraseña:</label>
            <input type="password" class="form-control" id="contrasena" v-model="student.contrasena" />
          </div>
          <div class="form-group-left">
            <label for="semestre">Semestre:</label>
            <select class="form-control" id="semestre" v-model="student.semestre">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <div class="form-group-left">
            <label for="grupo">Grupo:</label>
            <input type="text" class="form-control" id="grupo" v-model="student.grupo" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group-right">
            <label for="identificador">Identificador:</label>
            <input type="text" class="form-control" id="identificador" v-model="student.identificador" />
          </div>
          <div class="form-group-right">
            <div class="template-action">
              <label>Agregar por plantilla Excel:</label>
              <button class="btn btn-secondary" @click="openTemplateModal" type="button">Añadir por plantilla</button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Añadir alumno</button>
      </form>
    </div>
    <!-- Modal for template -->
    <AddXlsx v-if="templateModalVisible" @close="templateModalVisible = false">
      <template v-slot:header>
        <h2>Plantilla de Excel</h2>
      </template>
      <template v-slot:body>
        <button class="btn btn-secondary" @click="downloadTemplate">Descargar Plantilla</button> <br> <br>
        <input type="file" @change="handleFileUpload" /> <br>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary" @click="addRecipientsByTemplate">Subir Plantilla</button>
      </template>
    </AddXlsx>
    <dialog class="errors-modal" v-if="errors">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </dialog>
  </BaseLayout>
</template>

<script>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import apiService from '../services/api.service';
import BaseLayout from '../layout/BaseLayout.vue';
import { useToast } from 'vue-toast-notification';
import AddXlsx from '../components/AddXlsx.vue';

export default {
  components: {
    BaseLayout,
    AddXlsx
  },
  setup() {
    const student = ref({
      nombre: '',
      contrasena: '',
      semestre: '',
      grupo: '',
      identificador: ''
    });
    const file = ref(null);
    const templateModalVisible = ref(false);
    const $toast = useToast();

    const openTemplateModal = () => {
      templateModalVisible.value = true;
    };

    const addStudent = async () => {
      const { nombre, contrasena, semestre, grupo, identificador } = student.value;
      console.log(student.value);
      if (!nombre || !contrasena || !semestre || !grupo || !identificador) {
        return $toast.error('Por favor llena todos los campos.');
      }

      const data = {
        nombre,
        contrasena,
        semestre,
        grupo,
        usuario: identificador
      };

      try {
        await apiService.post('/estudiantes', data);
        $toast.success('El estudiante fue añadido correctamente.');
        student.value = {
          nombre: '',
          contrasena: '',
          semestre: '',
          grupo: '',
          identificador: ''
        };
      } catch (error) {
        console.error('Error adding student:', error);
        $toast.error('Hubo un error al añadir algunos estudiantes, comprueba si ya existe el identificador.');
      }
    };

    const downloadTemplate = () => {
      // Leer la plantilla desde el directorio público
      const templateFile = '/plantilla.xlsx';
      const link = document.createElement('a');
      link.href = templateFile;
      link.download = 'plantilla_estudiantes.xlsx';
      link.click();
    };

    const handleFileUpload = (event) => {
      file.value = event.target.files[0];
    };
    const downloadErrorsAsXlsx = (errors) => {
      const transformedErrors = errors.map(error => ({
      Nombre: error.nombre,
      Contraseña: error.contrasena,
      Semestre: error.semestre,
      Grupo: error.grupo,
      Identificador: error.usuario
      }));

      const worksheet = XLSX.utils.json_to_sheet(transformedErrors);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Errores');

      // Generar archivo Excel
      const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Crear enlace para descargar el archivo
      const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'errores_estudiantes.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const addRecipientsByTemplate = async () => {
      if (!file.value) {
        return $toast.error({ text: 'Por favor selecciona un archivo.' });
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const sheetIndex = 0; // Usar el primer sheet

        let df = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[sheetIndex]]);
        df = df.filter(o => o.Nombre && o.Contraseña && o.Semestre && o.Grupo && o.Identificador).map(o => ({
          nombre: o.Nombre,
          contrasena: o.Contraseña,
          semestre: o.Semestre,
          grupo: o.Grupo,
          usuario: o.Identificador
        }));

        if (df.length === 0) {
          return $toast.error('El archivo no contiene datos válidos.');
        }

        const errors = [];
        for (const element of df) {
          try {
            await apiService.post('/estudiantes', element);
          } catch (error) {
            errors.push(element);
          }
        }
        if (errors.length > 0) {
          $toast.error('Hubo errores al importar algunos estudiantes, revisa su identificador.');
          downloadErrorsAsXlsx(errors);

        } else {
          $toast.success('Los datos fueron importados correctamente.');
        }
        templateModalVisible.value = false;
        file.value = null;
      };

      reader.readAsArrayBuffer(file.value);
    };

    return {
      student,
      file,
      templateModalVisible,
      openTemplateModal,
      downloadTemplate,
      handleFileUpload,
      addRecipientsByTemplate,
      addStudent
    };
  }
};
</script>

<style scoped>
@import '../assets/css/AddUsers.css';
</style>
