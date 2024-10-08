<template>
    <BaseLayout>
        <div class="container">
            <h1 class="title">Modificar Estudiante</h1>

            <div class="search-bar">
                <label for="search">Buscar Estudiante:</label>
                <input type="text" id="search" v-model="searchQuery" @input="filterStudents"
                    placeholder="Ingresa nombre del estudiante" />
                <ul v-if="studentMatches.length" class="search-results">
                    <li v-for="student in studentMatches" :key="student._id" @click="selectStudent(student)"
                        class="search-item">
                        {{ student.nombre }}
                    </li>
                </ul>
            </div>
            <button @click="templateModalVisible = true" v-if="!selectedStudent" class="pics-button">Subir Fotografías</button>

            <div v-if="selectedStudent" class="edit-student-fields">
                <form @submit.prevent="updateStudent" class="form">
                    <div class="form-field">
                        <label for="nombre">Nombre:</label>
                        <input type="text" v-model="updatedFields.nombre" />
                    </div>
                    <div class="form-field">
                        <label for="contrasena">Contraseña:</label>
                        <input type="password" v-model="updatedFields.contrasena" />
                    </div>
                    <div class="form-field">
                        <label for="semestre">Semestre:</label>
                        <input type="text" v-model="updatedFields.semestre" />
                    </div>
                    <div class="form-field">
                        <label for="puntos">Puntos:</label>
                        <input type="text" v-model="updatedFields.puntos" />
                    </div>
                    <div class="form-field">
                        <label for="grupo">Grupo:</label>
                        <input type="text" v-model="updatedFields.grupo" />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>

                <!-- Botón para abrir el modal -->
            </div>

            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success">{{ successMessage }}</div>

            <!-- Modal para subir fotos -->
            <AddXlsx v-if="templateModalVisible" @close="templateModalVisible = false">
                <template v-slot:header>
                    <h2>Subir Fotografías</h2>
                </template>
                <template v-slot:body>
                    <input type="file" multiple id="fotografias" /> <br>
                </template>
                <template v-slot:footer>
                    <button class="modal-button" @click="subirFotos">Subir Fotografías</button>
                </template>
            </AddXlsx>
        </div>
    </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';
import AddXlsx from '../components/AddXlsx.vue'; // Importa el modal
import apiService from '../services/api.service';
import { useToast } from 'vue-toast-notification';
import { validateJWT, validateAdmin } from '../services/auth.pages';

validateAdmin();
validateJWT();

const searchQuery = ref('');
const students = ref([]);
const studentMatches = ref([]);
const selectedStudent = ref(null);
const toast = useToast();
const templateModalVisible = ref(false); // Control de visibilidad del modal

const updatedFields = ref({
    nombre: '',
    contrasena: '',
    semestre: '',
    grupo: '',
    puntos: '',
});

const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
    try {
        const response = await apiService.get('/estudiantes');
        students.value = response;
    } catch (error) {
        errorMessage.value = 'Error al cargar los estudiantes.';
    }
});

const filterStudents = () => {
    if (!students.value) {
        return;
    }

    studentMatches.value = students.value.filter(student =>
        student.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
};

const selectStudent = student => {
    selectedStudent.value = student;
    updatedFields.value = {
        nombre: student.nombre,
        contrasena: '',
        semestre: student.semestre,
        grupo: student.grupo,
        puntos: student.puntos,
    };
    studentMatches.value = [];
};

const updateStudent = async () => {
    try {
        const studentId = selectedStudent.value._id;
        const response = await apiService.patch(`/estudiantes/${studentId}`, updatedFields.value);
        successMessage.value = 'Estudiante actualizado exitosamente.';
        errorMessage.value = '';
    } catch (error) {
        errorMessage.value = 'Error al actualizar el estudiante.';
    }
};

// Función para subir las fotos
const subirFotos = async () => {
    const fotografias = document.getElementById('fotografias').files;

    // Check if files are selected
    if (!fotografias.length) {
        return toast.error('Por favor, selecciona una o más fotografías.', true);
    }

    const subirFotosEstudiante = async (fotografias) => {
        for (let i = 0; i < fotografias.length; i++) {
            const fotografia = fotografias[i];
            const fotografiaName = fotografia.name.split('.').slice(0, -1).join('.');

            const formData = new FormData();
            formData.append('fotografia', fotografia);  // Appending one image at a time

            try {
                // First, get the student ID based on the filename
                const response = await fetch(`http://localhost:5000/api/estudiantes/username/${fotografiaName}`);
                const data = await response.json();

                if (data && data._id) {
                    // Then, upload the picture to the corresponding student
                    const postResponse = await fetch(`http://localhost:5000/api/estudiantes/picture/${data._id}`, {
                        method: 'PATCH',
                        body: formData,
                    });

                    if (postResponse.ok) {
                        toast.success(`Imagen ${fotografiaName} subida correctamente.`);
                    } else {
                        toast.error(`Error al subir la imagen ${fotografiaName}.`, true);
                    }
                } else {
                    toast.error(`Estudiante no encontrado para la imagen ${fotografiaName}.`, true);
                }
            } catch (error) {
                console.error('Error al procesar la fotografía:', error);
                toast.error(`Error al procesar la imagen ${fotografiaName}.`, true);
            }
        }
    };

    await subirFotosEstudiante(fotografias);  // Call the async upload function
};

</script>


<style scoped>
.modal-button {
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: #28a745;
    color: #fff;
    margin-top: 20px;
}
.modal-button:hover {
    background-color: #28a745e0;
}
.pics-button {
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: #2E2B75;
    color: #fff;
    margin-top: 20px;
}
.container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 4rem;
    /* Aumenta el tamaño del título */
    margin-bottom: 20px;
    font-family: Jomolhari;
}

.search-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.search-bar label {
    font-size: 1.2rem;
    /* Tamaño de etiqueta ajustado */
    font-weight: bold;
}

.search-bar input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 15px;
    font-size: 1rem;
}

.search-results {
    margin-top: 5px;
    list-style: none;
    padding: 0;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    border-radius: 15px;
    /* Esquinas redondeadas para los resultados */
}

.search-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-item:hover {
    background-color: #f0f0f0;
    /* Efecto al pasar el cursor */
}

.edit-student-fields {
    margin-top: 20px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* Espacio entre secciones */
}

.form-field {
    display: flex;
    flex-direction: column;
}

.form-field label {
    margin-bottom: 5px;
    font-size: 1.1rem;
    /* Tamaño de etiqueta ajustado */
    font-weight: bold;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
}
.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
}

.form-field input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 15px;
    font-size: 1rem;
}

button {
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

button[type="submit"] {
    background-color: #2E2B75;
    /* Color de botón primario */
    color: #fff;
}

button[type="submit"]:hover {
    background-color: #2e2b75e0;
    /* Color al pasar el cursor */
}

.error {
    color: red;
    margin-top: 10px;
}

.success {
    color: green;
    margin-top: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .search-bar {
        flex-direction: column;
        align-items: center;
    }

    .search-results {
        max-height: 100px;
        overflow-y: auto;
    }

    .edit-student-fields {
        margin-top: 10px;
    }

    .form-field {
        margin-bottom: 10px;
    }
}
</style>