<template>
    <BaseLayout>
        <div class="container">
            <h1 class="title">Modificar Usuarios</h1>

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
            <button @click="templateModalVisible = true" v-if="!selectedStudent" class="pics-button">Subir
                Fotografías</button>

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
                    <h1 style="font-size: 2rem; ">Subir Fotografías</h1>
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
                        <input type="file" multiple id="fotografias" />
                    </div>
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
import { url } from '../services/api.config';

validateAdmin();
validateJWT();

const searchQuery = ref('');
const students = ref([]);
const studentMatches = ref([]);
const selectedStudent = ref(null);
const toast = useToast();
const templateModalVisible = ref(false); // Control de visibilidad del modal
const tipoUsuario = ref('estudiante');
const user = JSON.parse(localStorage.getItem('user'));

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
    if (!user.user || !user.user.cambioContrasena) {
        console.log(user.user)
        $toast.error('Es necesario cambiar la contraseña.');
        router.push('/configure');
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

const subirFotos = async () => {
    const fotografias = document.getElementById('fotografias').files;

    // Verificar si se seleccionaron archivos
    if (!fotografias.length) {
        return toast.error('Por favor, selecciona una o más fotografías.', true);
    }

    // Función que sube todas las fotos
    const subirTodo = async (fotografias) => {
        const promesas = []; // Array para almacenar las promesas de subida

        for (let i = 0; i < fotografias.length; i++) {
            const fotografia = fotografias[i];
            const fotografiaName = fotografia.name.split('.').slice(0, -1).join('.');

            const promesa = (async () => {
                try {
                    let usuario; // Definido aquí para ser accesible
                    // Buscar el ID del estudiante/maestro basado en el nombre del archivo
                    if (tipoUsuario.value === 'estudiante') {
                        usuario = await apiService.get(`/estudiantes/username/${fotografiaName}`);
                    } else {
                        usuario = await apiService.get(`/maestros/user/${fotografiaName}`);
                    }

                    console.log('Respuesta de la API:', usuario);

                    // Verificar si la respuesta es válida
                    if (usuario && usuario._id) {
                        const formData = new FormData();
                        formData.append('fotografia', fotografia); // Añadir el archivo
                        console.log('Archivo que se va a enviar:', formData.get('fotografia'));


                        let response; // Definido aquí para ser accesible
                        if (tipoUsuario.value === 'estudiante') {
                            response = await fetch(`${url}api/estudiantes/picture/${usuario._id}`, {
                        method: 'POST',
                        body: formData,
                    });
                        } else {
                            response = await fetch(`${url}api/maestros/picture/${usuario._id}`, {
                        method: 'POST',
                        body: formData,
                    }
                            );
                        }

                        // Aquí accedemos a la respuesta completa y al estado
                        const status = response.status; // Esto puede ser undefined
                        console.log('Respuesta de la API:', response);

                        // Verifica que response tenga un estado definido
                        if (status === 200 || status === 204) {
                            toast.success(`Imagen ${fotografiaName} subida correctamente.`);
                        } else {
                            const errorCode = status || 'undefined';
                            toast.error(`Error al subir la imagen ${fotografiaName}. Código: ${errorCode}`, true);
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