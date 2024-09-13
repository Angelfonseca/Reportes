<template>
    <div  class="pdf-table-container">
        <div class="sheet">
            <div class="sheet-header">
                <h1 class="title">Hoja de reportes por fecha</h1>
                <p class="date-range">Desde la fecha {{ startDate }}, hasta {{ endDate }}</p>
                <p class="report-count">N° DE AMONESTACIONES/HOJA: {{ reportes.length }}</p>
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
                            <th class="table-header">Firma quien reporta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reporte in reportesConGrupo" :key="reporte.id" class="table-row">
                            <td class="table-cell">{{ reporte.grupo }}</td>
                            <td class="table-cell">{{ reporte.student_name }}</td>
                            <td class="table-cell">{{ reporte.reason }}</td>
                            <td class="table-cell">{{ new Date(reporte.createdAt).toLocaleString() }}</td>
                            <td class="table-cell">{{ reporte.teacher_name }}</td>
                            <td class="table-cell">{{ reporte.teacher_signature }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <button class="pdf-button" @click="generatePDF">Descargar como PDF</button>
        <button class="close-button" @click="$emit('close')">Cerrar</button>
        <div class="page-number">{{ page }} / {{ pages }}</div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import apiService from '../services/api.service';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
export default {
    name: 'PDFTable',
    props: {
        reportes: {
            type: Array,  // Asegúrate de que el tipo de `reportes` sea Array
            required: true
        },
        startDate: String,
        endDate: String
    },
    setup(props) {
        const reportesConGrupo = ref([]);


        const getGrupoDeEstudiante = async (idEstudiante) => {
            try {
                const response = await apiService.get(`/estudiantes/get/${idEstudiante}`);
                return response.semestre+response.grupo;
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

        // Ejecutar cuando cambie la propiedad `reportes`
        watch(() => props.reportes, agregarGrupoAReportes, { immediate: true });

        const generatePDF = () => {
           
            const element = document.querySelector('.sheet');
            const options = {
                margin: 0.5,
                filename: `reportes-${props.startDate}-${props.endDate}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            const buttons = document.querySelector('.pdf-buttons');
            if (buttons) buttons.style.display = 'none';

            html2pdf().from(element).set(options).toPdf().get('pdf').then(pdf => {
                // Restaurar visibilidad de los botones después de generar el PDF
                if (buttons) buttons.style.display = 'flex';

                // Ajustar tamaño de página para evitar segunda página en blanco
                pdf.internal.pageSize.width = pdf.internal.pageSize.width - 0.5;

                pdf.autoPrint();
                pdf.output('dataurlnewwindow');
            });
        }

        return {
            reportesConGrupo,
            generatePDF
        };
    }
};
</script>

<style scoped>
.pdf-table-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 297mm; /* Ancho de una hoja A4 */
    height: 210mm; /* Alto de una hoja A4 */
    margin: 0;
    padding: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.sheet {
    width: 100%;
    height: 100%;
    padding: 20mm;
    box-sizing: border-box;
}

.sheet-header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.date-range {
    font-size: 18px;
    color: #666;
}

.report-count {
    font-size: 18px;
    color: #666;
}

.pdf-button {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.pdf-button:hover {
    background-color: #3e8e41;
}

.close-button {
    position: absolute;
    bottom: 10px;
    left: calc(50% + 120px);
    /* Adjust this value based on the width of the pdf-button */
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.close-button:hover {
    background-color: #3e8e41;
}

.close-button:hover {
    background-color: #3e8e41;
}

.pdf-button {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.pdf-button:hover {
    background-color: #3e8e41;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table-header {
    background-color: #f0f0f0;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-size: 14px;
}

.table-row {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.table-cell {
    padding: 10px;
    border-right: 1px solid #ddd;
    text-align: left;
    font-size: 12px;
    height: auto;
}

.table-cell:last-child {
    border-right: none;
}
.page-number {
    position: absolute;
    bottom: 10mm;
    right: 10mm;
    font-size: 12px;
    color: #666;
}

/* Ajustes para impresión en PDF */
@media print {
    body {
        margin: 0;
        padding: 0;
        background-color: white;
    }

    .pdf-table-container {
        box-shadow: none;
        border: none;
        width: 297mm;
        height: 210mm;
        margin: 0;
    }
}

/* Ajustes para móviles */
@media only screen and (max-width: 768px) {
    .pdf-table-container {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 10px;
    }

    .sheet {
        flex-direction: column;
        align-items: center;
    }

    .sheet-header {
        text-align: center;
        margin-bottom: 10px;
    }

    .title {
        font-size: 18px;
    }

    .date-range {
        font-size: 14px;
    }

    .report-count {
        font-size: 14px;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table-header {
        background-color: #f0f0f0;
        padding: 5px;
        border-bottom: 1px solid #ddd;
        text-align: left;
        font-size: 12px;
    }

    .table-row {
        padding: 5px;
        border-bottom: 1px solid #ddd;
    }

    .table-cell {
        padding: 5px;
        border-right: 1px solid #ddd;
        text-align: left;
        font-size: 12px;
    }

    .table-cell:last-child {
        border-right: none;
    }
}
</style>
