<template>
    <div class="pdf-table-container">
        <!-- Selector de hojas -->
        <div class="page-selector">
            <label for="pageSelect">Seleccionar hoja:</label>
            <select id="pageSelect" v-model="selectedPage" @change="updateCurrentPage">
                <option v-for="pageNum in totalPages" :key="pageNum" :value="pageNum">
                    Hoja {{ pageNum }}
                </option>
            </select>
        </div>

        <!-- Contenido de la hoja -->
        <div class="sheet" v-for="(reports, index) in paginatedReports" :key="index"
            v-show="index + 1 === selectedPage">
            <div class="sheet-header">
                <img class="navlogo" src="/navlogo.png" alt="Logo">
                <h1 class="title">Hoja de reportes por fecha</h1>
                <p class="date-range">Desde la fecha {{ startDate }}, hasta {{ endDate }}</p>
                <p class="report-count">N° DE AMONESTACIONES/HOJA: {{ reports.length }}</p>
            </div>
            <div class="sheet-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="table-header">Grupo</th>
                            <th class="table-header">Nombre</th>
                            <th class="table-header">Motivo</th>
                            <th class="table-header">Fecha</th>
                            <th class="table-header">Quien reporta</th>
                            <th class="table-header">Categoria</th>
                            <th class="table-header">Firma quien reporta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reporte in reports" :key="reporte.id" class="table-row">
                            <td class="table-cell" data-label="Grupo">{{ reporte.grupo }}</td>
                            <td class="table-cell" data-label="Nombre">{{ reporte.student_name }}</td>
                            <td class="table-cell" data-label="Motivo">{{ reporte.reason }}</td>
                            <td class="table-cell" data-label="Fecha">{{ new Date(reporte.createdAt).toLocaleString() }}
                            </td>
                            <td class="table-cell" data-label="Quien reporta">{{ reporte.teacher_name }}</td>
                            <td class="table-cell" data-label="Categoria">{{ reporte.category }}</td>
                            <td class="table-cell" data-label="Firma quien reporta">{{ reporte.teacher_signature }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="signature-section">
                <div class="signature-line"></div>
                <p class="signature-text">NOMBRE Y FIRMA DEL ÁREA DE PREFECTURA</p>
            </div>
        </div>

        <!-- Botones para PDF y Cerrar -->
        <div class="button-container">
            <button class="pdf-button" @click="generatePDF">Descargar como PDF</button>
            <button class="close-button" @click="$emit('close')">Cerrar</button>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import apiService from '../services/api.service';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

export default {
    name: 'PDFTable',
    props: {
        reportes: {
            type: Array,
            required: true
        },
        startDate: String,
        endDate: String
    },
    setup(props) {
        const reportesConGrupo = ref([]);
        const selectedPage = ref(1);
        const reportsPerPage = 14; // Número de reportes por hoja

        // Función para obtener grupo del estudiante
        const getGrupoDeEstudiante = async (idEstudiante) => {
            try {
                const response = await apiService.get(`/estudiantes/get/${idEstudiante}`);
                return response.semestre + response.grupo;
            } catch (error) {
                console.error('Error al obtener el grupo del estudiante:', error);
                return null;
            }
        };

        const agregarGrupoAReportes = async () => {
            const reportesConGrupoTemp = [];
            for (const reporte of props.reportes) {
                const grupo = await getGrupoDeEstudiante(reporte.student_id);
                reportesConGrupoTemp.push({ ...reporte, grupo });
            }
            reportesConGrupo.value = reportesConGrupoTemp;
        };

        // Dividir los reportes en páginas
        const paginatedReports = computed(() => {
            const pages = [];
            for (let i = 0; i < reportesConGrupo.value.length; i += reportsPerPage) {
                pages.push(reportesConGrupo.value.slice(i, i + reportsPerPage));
            }
            return pages;
        });

        const totalPages = computed(() => paginatedReports.value.length);

        const updateCurrentPage = () => {
            // Actualiza la página seleccionada
            if (selectedPage.value < 1) {
                selectedPage.value = 1;
            } else if (selectedPage.value > totalPages.value) {
                selectedPage.value = totalPages.value;
            }
        };

        // Generar PDF
        const generatePDF = async () => {
    const sheets = document.querySelectorAll('.sheet');
    const options = {
        margin: [0.5, 0.5],
        filename: `reportes-${props.startDate}-${props.endDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const buttons = document.querySelector('.button-container');
    if (buttons) buttons.style.display = 'none';

    const pdf = new jsPDF();

    // Probar solo con la primera hoja para empezar
    const sheet = sheets[0]; // Cambiar a sheets[i] para iterar
    try {
        const canvas = await html2pdf().from(sheet).set(options).toCanvas();
        if (!canvas) {
            throw new Error('El canvas no se ha generado correctamente.');
        }
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    } catch (error) {
        console.error('Error al generar la imagen del canvas:', error);
    }

    // Guarda el PDF
    pdf.save(`reportes-${props.startDate}-${props.endDate}.pdf`);

    // Restaurar estilos originales
    if (buttons) buttons.style.display = 'flex';
};



        // Observar cambios en los reportes
        watch(() => props.reportes, agregarGrupoAReportes, { immediate: true });

        return {
            reportesConGrupo,
            selectedPage,
            paginatedReports,
            totalPages,
            updateCurrentPage,
            generatePDF
        };
    }
};
</script>

<style scoped>
/* Agrega tus estilos aquí o en un archivo CSS separado */
@import '../assets/componentscss/PDFTable.css';

/* Puedes agregar un estilo básico para el selector de hojas */
.page-selector {
    margin-bottom: 20px;
}

.sheet {
    margin-bottom: 40px;
    border: 1px solid #ccc;
    padding: 10px;
}

.signature-section {
    margin-top: 20px;
}

.signature-line {
    border-bottom: 1px solid black;
    width: 200px;
    margin: auto;
}

.signature-text {
    text-align: center;
    margin-top: 10px;
}
</style>
