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
                        <th>Descripción</th>
                        <th>Maestro</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(reporte, index) in reportes" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ reporte.reason }}</td>
                        <td>{{ reporte.teacher_name }}</td>
                        <td>{{ new Date(reporte.createdAt).toLocaleDateString() }}</td>
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
                // Obtener detalles de cada reporte por su ID
                const reportesPromises = this.alumno.reportes.map(id => 
                    apiService.get(`/reportes/${id}`)
                );
                console
                const reportesResponses = await Promise.all(reportesPromises);

                // Mapear los resultados y guardar en el array de reportes
                this.reportes = reportesResponses.map(res => res);

                // Mostrar el modal
                this.visible = true;
            } catch (error) {
                console.error('Error al buscar los reportes:', error);
            }
        }
    },
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

            html2pdf().from(element).set(options).toPdf().get('pdf').then(pdf => {
                // Restaurar visibilidad de los botones después de generar el PDF
                if (buttons) buttons.style.display = 'flex';

                // Ajustar tamaño de página para evitar segunda página en blanco
                pdf.internal.pageSize.width = pdf.internal.pageSize.width - 0.5;

                pdf.autoPrint();
                pdf.output('dataurlnewwindow');
            });
        }
    }
}
</script>


<style scoped>
/* General overlay styling */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.navlogo {
    width: 250px;
    height: 100px;
    margin: 0 auto; 
    justify-content: center;
    align-items: center;
    display: flex;
}

/* Modal styling */
.sheet {
    background-color: white;
    width: 7.5in;
    /* Ajustado para evitar desbordamiento */
    height: 10in;
    /* Ajustado para evitar desbordamiento */
    margin: 0 auto;
    /* Centrado horizontal */
    padding: 1in;
    /* Espaciado interno */
    border: 1px solid #ccc;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
    box-sizing: border-box;
    /* Incluye padding y border en el tamaño total */
}

/* Title and date styling */
.title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
    /* Adjusted spacing */
}

.date {
    text-align: right;
    font-size: 14px;
    /* Adjusted for better readability */
    margin-bottom: 20px;
    /* Adjusted spacing */
}

/* Table styling */
.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

.report-table th,
.report-table td {
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 16px;
    /* Adjusted for readability */
}

.report-table th {
    background-color: #f2f2f2;
    text-align: left;
}

/* No report message styling */
.no-report {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    color: #721c24;
    text-align: center;
}

/* Signature styling */
.signature {
    margin-top: 30px;
    /* Adjusted spacing */
    text-align: center;
}

.signature-line {
    border-top: 1px solid #000;
    margin: 10px auto;
    width: 60%;
    /* Adjusted width */
}

/* Button styling */
.pdf-buttons {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    /* Stack buttons vertically */
    gap: 10px;
    align-items: center;
}

button {
    padding: 12px 20px;
    /* Adjusted padding */
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    /* Adjusted font size */
    width: 100%;
    /* Full width on mobile */
}

button:hover {
    background-color: #0056b3;
}

/* Hide buttons in PDF */
@media print {
    .sheet {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
    }
}


@media (max-width: 780px) {
    .sheet {
      width: 90%; /* Adjusted width for mobile */
      padding: 10px; /* Adjusted padding */
      font-size: 14px; /* Adjusted font size for mobile */
    }

    .title {
      font-size: 18px; /* Adjusted font size for mobile */
      text-align: center; /* Center title text */
    }

    .date {
      font-size: 12px; /* Adjusted font size for mobile */
      text-align: center; /* Center date text */
    }

    .report-table {
      font-size: 12px; /* Adjusted font size for mobile */
    }

    .report-table th,
    .report-table td {
      padding: 5px; /* Adjusted padding for mobile */
    }

    .signature-line {
      width: 80%; /* Adjusted width for mobile */
    }

    .pdf-buttons {
      flex-direction: row; /* Change button layout to horizontal on mobile */
      gap: 5px; /* Adjusted gap between buttons */
    }

    button {
      padding: 8px 15px; /* Adjusted padding for mobile */
      font-size: 14px; /* Adjusted font size for mobile */
    }
  }
</style>