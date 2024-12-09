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

            <div v-if="selectedStudent" class="edit-student-fields">
                <form @submit.prevent="updateStudent" class="form">
                    <div class="form-field">
                        <label for="nombre">Nombre:</label>
                        <input class="Nombre" type="text" v-model="updatedFields.nombre" />
                    </div>
                    <div class="form-field">
                        <label for="contrasena">Contraseña:</label>
                        <input class="contrasena" type="password" v-model="updatedFields.contrasena" />
                    </div>
                    <div class="form-field">
                        <label for="semestre">Semestre:</label>
                        <input class="semestre" type="text" v-model="updatedFields.semestre" />
                    </div>
                    <div class="form-field">
                        <label for="puntos">Puntos:</label>
                        <input class="puntos" type="text" v-model="updatedFields.puntos" />
                    </div>
                    <div class="form-field">
                        <label for="grupo">Grupo:</label>
                        <input class="grupo" type="text" v-model="updatedFields.grupo" />
                    </div>
                    <button class="btn-modify" type="submit">Guardar Cambios</button>
                </form>
            </div>

            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success">{{ successMessage }}</div>

        </div>
    </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../services/api.service';
import { useToast } from 'vue-toast-notification';
import { validateJWT, onlyAdmin } from '../services/auth.pages';
import { url } from '../services/api.config';

onlyAdmin();
validateJWT();

const searchQuery = ref('');
const students = ref([]);
const studentMatches = ref([]);
const selectedStudent = ref(null);
const toast = useToast();
const templateModalVisible = ref(false); // Control de visibilidad del modal
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


</script>


<style scoped>
@import '../assets/css/ModifyUser.css';
</style>