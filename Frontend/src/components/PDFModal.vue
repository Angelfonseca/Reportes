<template>
    <div v-if="visible" class="overlay" @click.self="closeModal">
        <div class="sheet">
            <img class="navlogo" src="/navlogo.png" alt="Logo">
            <h1 class="title">Certificado de historial de reportes</h1>
            <p class="date">Fecha: {{ currentDate }}</p>
            <p>
                Por este medio, se da a constar que el alumno:
                <strong>{{ alumno.nombre }}</strong>, con número de folio
                <strong>{{ alumno.usuario }}</strong>, tiene en su historial de reportes el siguiente contenido:
            </p>

            <!-- Tabla de reportes -->
            <table v-if="reportes.length" class="report-table">
                <thead>
                    <tr>
                        <th>Número de Reporte</th>
                        <th>Razón</th>
                        <th>Maestro</th>
                        <th>Fecha</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(reporte, index) in reportes" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ reporte.reason }}</td>
                        <td>{{ reporte.teacher_name }}</td>
                        <td>{{ new Date(reporte.createdAt).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="no-report">
                <p>No se encontraron reportes en el historial del alumno.</p>
                <p>
                    Si considera que esto es un error, por favor, contacte con la administración para verificar la
                    información.
                </p>
            </div>

            <!-- Firma -->
            <div class="signature">
                <p>Firma del estudiante:</p>
                <div class="signature-line"></div>
                <p>{{ alumno.nombre }}</p>
                <p>{{ alumno.usuario }}</p>
            </div>
        </div>

        <!-- Botones para exportar y cerrar -->
        <div class="pdf-buttons">
            <button class="dwnld-pdf" @click="downloadPdf(alumnoId)">Descargar PDF</button>
            <button @click="closeModal">Cerrar</button>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api.service';

export default {
  name: 'PDFModal',
  props: {
    alumno: Object
  },
  data() {
    return {
      reportes: [], // Array de reportes con detalles
      visible: false, // Modal inicialmente oculto
      currentDate: new Date().toLocaleDateString(), // Fecha actual en formato local
      alumnoId: this.alumno ? this.alumno._id : null // Asegura que se obtenga el ID del alumno si está disponible
    };
  },
  async mounted() {
    if (this.alumno && this.alumno.reportes) {
      try {
        const reportesPromises = this.alumno.reportes.map(id =>
          apiService.get(`/reportes/${id}`)
        );
        const reportesResponses = await Promise.all(reportesPromises);

        // Asegura que reportes no sea null o undefined
        this.reportes = reportesResponses.map(res => res) || [];

        // Haz visible el modal solo cuando los datos de los reportes estén listos
        this.visible = true;
      } catch (error) {
        console.error('Error al buscar los reportes:', error);
        this.visible = false;
      }
    } else {
      this.visible = false;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    async downloadPdf(alumnoId) {
  try {
    // Llamada a la API para obtener el PDF en formato Base64
    const response = await apiService.get(`/estudiantes/pdf/${alumnoId}`);

    if (!response) {
      alert('El PDF está vacío o no se recibió correctamente.');
      return;
    }

    // Usa directamente la cadena Base64, no es necesario usar split
    const base64Data = response; // No necesitas el split
    const binaryData = window.atob(base64Data); // Decodifica el Base64

    // Convierte la cadena binaria en un array de bytes
    const len = binaryData.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Crea un Blob a partir del array de bytes
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // Crea una URL temporal para el blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_alumno_${alumnoId}.pdf`; // Nombre del archivo generado
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Limpia el DOM después de la descarga

    // Revoca la URL después de un pequeño retraso
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error descargando el PDF:', error);
    alert('Error al descargar el PDF.');
  }
}
  }
};
</script>



<style scoped>
@import '../assets/componentscss/PDFModal.css';
</style>