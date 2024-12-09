<template>
    <BaseLayout>
        <div class="admin-container">
            <h1>Administrar Estudiantes</h1>
            <div class="controls">
                <select v-model="selectedSemestre" @change="filterBySemestre">
                    <option value="" disabled>Seleccionar semestre</option>
                    <option v-for="semestre in semestres" :key="semestre" :value="semestre">
                        {{ semestre }}
                    </option>
                </select>
                <input type="text" v-model="searchTerm" placeholder="Buscar estudiante..." @input="filterBySearch" />
            </div>

            <div class="select-buttons">
                <button @click="selectAllFiltered">Seleccionar alumnos filtrados</button><br><br>
                <button @click="openModal">Subir Fotos</button>
                <br><br>
            </div>

            <div class="table-responsive">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Seleccionar</th>
                            <th>Nombre</th>
                            <th>Identificador</th>
                            <th>Semestre</th>
                            <th>Grupo</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tr v-for="student in paginatedStudents" :key="student._id"
                        :class="{ active: student.semestre === selectedSemestre }">
                        <td><input type="checkbox" v-model="selectedStudents" :value="student._id" /></td>
                        <td>{{ student.nombre }}</td>
                        <td>{{ student.usuario }}</td>
                        <td>{{ student.semestre }}</td>
                        <td>{{ student.grupo }}</td>
                        <td>{{ student.puntos }}</td>
                    </tr>


                </table>
                <br>
            </div>

            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
            </div>

            <div class="buttons">
                <button @click="deleteFueraSistema">Eliminar Estudiantes Fuera del sistema</button>
                <button @click="updateSemestre" :disabled="!selectedStudents.length">Actualizar Semestre</button>
                <button @click="returnPoints" :disabled="!selectedStudents.length" >Restablecer puntos</button>
            </div>

            <!-- Modal para subir fotos -->
            <AddXlsx v-if="isModalOpen" @close="closeModal">
                <template v-slot:header>
                    <h1 style="font-size: 2rem;">Subir Fotografías</h1>
                </template>
                <template v-slot:body>
                    <div class="form-field">
                        <label for="tipoUsuario">Selecciona el tipo de usuario:</label>
                        <select id="tipoUsuario" v-model="tipoUsuario">
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="fotografias">Selecciona las fotografías:</label>
                        <input type="file" multiple id="fotografias" @change="handleFileUpload" />
                    </div>
                </template>
                <template v-slot:footer>
                    <button class="modal-button" @click="subirFotos">Subir Fotografías</button>
                </template>
            </AddXlsx>
        </div>
    </BaseLayout>
</template>
<script>
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../services/api.service';
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import AddXlsx from '../components/AddXlsx.vue';

import { url } from '../services/api.config';

export default {
    components: {
        BaseLayout,
        AddXlsx
    },
    setup() {
        const students = ref([]);
        const selectedSemestre = ref('');
        const searchTerm = ref('');
        const selectedStudents = ref([]);
        const semestres = ref(["1", "2", "3", "4", "5", "6", "Todos"]);
        const toast = useToast();
        const tipoUsuario = ref('estudiante');


        // Modal state
        const isModalOpen = ref(false);
        const selectedFiles = ref([]);

        // Paginación
        const currentPage = ref(1);
        const itemsPerPage = ref(10);

        // Obtener estudiantes del sistema
        const getStudents = async () => {
            try {
                const response = await apiService.get('/estudiantes/ensistema');
                students.value = response;
            } catch (error) {
                toast.error('Error al obtener los estudiantes.');
            }
        };

        // Filtrar estudiantes por semestre y búsqueda
        const filteredStudents = computed(() => {
            let result = students.value;
            if (selectedSemestre.value && selectedSemestre.value !== 'Todos') {
            result = result.filter(student => student.semestre === selectedSemestre.value);
            }

            if (searchTerm.value) {
            if (searchTerm.value.length === 1) {
                result = result.filter(student =>
                student.grupo.toLowerCase().includes(searchTerm.value.toLowerCase())
                );
            } else {
                result = result.filter(student =>
                student.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                student.usuario.toLowerCase().includes(searchTerm.value.toLowerCase())
                );
            }
            }

            return result;
        });

        // Paginación: obtener estudiantes de la página actual
        const paginatedStudents = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value; // Inicio de página
            const end = start + itemsPerPage.value; // Fin de página
            return filteredStudents.value.slice(start, end); // Fragmento de estudiantes
        });

        const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage.value));

        // Seleccionar todos los estudiantes filtrados
        const selectAllFiltered = () => {
            filteredStudents.value.forEach(student => {
                if (!selectedStudents.value.includes(student._id)) {
                    selectedStudents.value.push(student._id);
                }
            });
        };

        // Eliminar estudiantes fuera del sistema
        const deleteFueraSistema = async () => {
            try {
                await apiService.delete('/estudiantes/fueraSistema');
                toast.success('Estudiantes eliminados con éxito.');
                getStudents(); // Actualizar la lista
            } catch (error) {
                toast.error('Error al eliminar los estudiantes.');
            }
        };

        // Actualizar semestre de los estudiantes seleccionados
        const updateSemestre = async () => {
            try {
                if (selectedStudents.value.length === 0) {
                    toast.error('No hay estudiantes seleccionados.');
                    return;
                }
                await apiService.post('/estudiantes/semestre', { students: selectedStudents.value });
                toast.success('Semestre actualizado con éxito.');
                getStudents(); // Actualizar la lista
            } catch (error) {
                toast.error('Error al actualizar el semestre.');
            }
        };

        // Paginación: cambiar de página
        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        // Funciones para el modal
        const openModal = () => {
            isModalOpen.value = true;
        };

        const closeModal = () => {
            isModalOpen.value = false;
            selectedFiles.value = []; // Limpiar archivos seleccionados
        };

        const handleFileUpload = (event) => {
            selectedFiles.value = Array.from(event.target.files);
        };


        getStudents();

        // Función para subir fotos
        const subirFotos = async () => {
            const fotografias = document.getElementById('fotografias').files;

            // Verificar si se seleccionaron archivos
            if (!fotografias.length) {
                return toast.error('Por favor, selecciona una o más fotografías.', true);
            }

            const subirTodo = async (fotografias) => {
                const promesas = [];

                for (let i = 0; i < fotografias.length; i++) {
                    const fotografia = fotografias[i];
                    const fotografiaName = fotografia.name.split('.').slice(0, -1).join('.');

                    const promesa = (async () => {
                        try {
                            let usuario;
                            if (tipoUsuario.value === 'estudiante') {
                                usuario = await apiService.get(`/estudiantes/username/${fotografiaName}`);
                            } else {
                                usuario = await apiService.get(`/maestros/user/${fotografiaName}`);
                            }

                            if (usuario && usuario._id) {
                                const formData = new FormData();
                                formData.append('fotografia', fotografia);

                                const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
                                let response;

                                if (tipoUsuario.value === 'estudiante') {
                                    response = await fetch(`${url}api/estudiantes/picture/${usuario._id}`, {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'Authorization': `${token}`
                                        }
                                    });
                                } else {
                                    response = await fetch(`${url}api/maestros/picture/${usuario._id}`, {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'Authorization': `${token}`
                                        }
                                    });
                                }

                                if (response.ok) {
                                    toast.success(`Imagen ${fotografiaName} subida correctamente.`);
                                } else {
                                    toast.error(`Error al subir la imagen ${fotografiaName}. Código: ${response.status}`, true);
                                }
                            } else {
                                toast.error(`Estudiante o maestro no encontrado para la imagen ${fotografiaName}.`, true);
                            }
                        } catch (error) {
                            console.error('Error al procesar la fotografía:', error);
                            toast.error(`Error al procesar la imagen ${fotografiaName}.`, true);
                        }
                    })();

                    promesas.push(promesa);
                }

                await Promise.all(promesas);
            };

            await subirTodo(fotografias);
        };

        const returnPoints = async () => {
            try {
                await apiService.post('/estudiantes/resetPoints', { students: selectedStudents.value });
                toast.success('Puntos restablecidos con éxito.');
                getStudents(); 
            } catch (error) {
                toast.error('Error al restablecer los puntos.');
            }
        };
        return {
            students,
            selectedSemestre,
            searchTerm,
            selectedStudents,
            semestres,
            filteredStudents,
            paginatedStudents,
            currentPage,
            totalPages,
            deleteFueraSistema,
            updateSemestre,
            selectAllFiltered,
            nextPage,
            prevPage,
            isModalOpen,
            openModal,
            closeModal,
            handleFileUpload,
            subirFotos, // Asegúrate de incluir la función subirFotos aquí
            returnPoints
        };
    }
};
</script>

<style scoped>
/* Contenedor principal */
.admin-container {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: 0 auto;
}

/* Títulos */
.admin-container h1 {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 1rem;
}

/* Controles */
.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    justify-content: space-between;
}

input[type="text"],
select {
    padding: 0.8rem 1rem;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

input[type="text"]:focus,
select:focus {
    border-color: #007BFF;
    outline: none;
}

/* Botones */
button {
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Botones secundarios */
.buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-top: 2rem;
}

/* Select y opciones */
.select-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
}

.select-buttons button {
    width: 100%;
    max-width: 300px;
}

/* Tabla */
.table-responsive {
    overflow-x: auto;
    margin-top: 1.5rem;
}

.students-table {
    width: 100%;
    border-collapse: collapse;
}

.students-table th,
.students-table td {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: left;
    font-size: 1rem;
}

.students-table th {
    background-color: #007BFF;
    color: white;
    text-transform: uppercase;
}

.students-table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.students-table tr:hover {
    background-color: #e6f7ff;
}

/* Paginación */
.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
}

.pagination-controls span {
    font-size: 1rem;
    color: #333;
}

.items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
}

/* Inputs y Selects en controles */
#itemsPerPage {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Modal */
.modal-button {
    background-color: #28a745;
    color: white;
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.modal-button:hover {
    background-color: #218838;
}

/* Responsivo */
@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        align-items: center;
    }

    input[type="text"],
    select {
        max-width: 100%;
    }

    .buttons button {
        max-width: 100%;
    }

    .pagination-controls {
        flex-direction: column;
        gap: 1rem;
    }

    .students-table th,
    .students-table td {
        font-size: 0.9rem;
        padding: 0.6rem;
    }
}
</style>
