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
            <button @click="exportToPDF">Exportar a PDF</button>
            <button @click="closeModal">Cerrar</button>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api.service';
import html2pdf from 'html2pdf.js';

export default {
    name: 'PDFModal',
    props: {
        alumno: Object
    },
    data() {
        return {
            reportes: [], // Array de reportes con detalles
            visible: false, // Modal inicialmente oculto
            currentDate: new Date().toLocaleDateString() // Fecha actual
        };
    },
    async mounted() {
        if (this.alumno && this.alumno.reportes) {
            try {
                const reportesPromises = this.alumno.reportes.map(id =>
                    apiService.get(`/reportes/${id}`)
                );
                const reportesResponses = await Promise.all(reportesPromises);

                this.reportes = reportesResponses.map(res => res);

                // Cambia la visibilidad del modal cuando los datos estén listos
                this.visible = true;
            } catch (error) {
                console.error('Error al buscar los reportes:', error);
            }
        } else {
            this.visible = false;
        }
    }
    ,
    methods: {
        closeModal() {
            this.$emit('close');
            this.visible = false;
        },
        exportToPDF() {
            if (!this.visible) return; // Evitar exportar si el modal no es visible

            const element = document.querySelector('.sheet');
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5], // Margen uniforme
                filename: `Certificado_Historial_Reportes_${this.alumno.nombre || 'Alumno'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Temporalmente ocultar los botones antes de generar el PDF
            const buttons = document.querySelector('.pdf-buttons');
            if (buttons) buttons.style.display = 'none';

            html2pdf().from(element).set(options).save().then(() => {
                // Restaurar visibilidad de los botones después de generar el PDF
                if (buttons) buttons.style.display = 'flex';
            }).catch(error => {
                console.error('Error al generar el PDF:', error);
                // Asegurar que los botones se vuelvan a mostrar si hay un error
                if (buttons) buttons.style.display = 'flex';
            });
            
        }

    }
}
</script>


<style scoped>
@import '../assets/componentscss/PDFModal.css';
</style>