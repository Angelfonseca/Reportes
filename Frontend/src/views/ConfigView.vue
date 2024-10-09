<template>
    <BaseLayout>
        <div class="container">
            <h1 class="title">Configuración de Usuario</h1>
            <div class="form">
                <div class="form-group">
                    <label for="nombre" class="label">Nombre:</label>
                    <input type="text" id="nombre" v-model="user.nombre" class="form-control" readonly />
                </div>
                <div class="form-group">
                    <label v-if="!validarAdmin" for="semestre" class="label">Semestre:</label>
                    <input v-if="!validarAdmin" type="text" id="semestre" v-model="user.semestre" class="form-control"
                        readonly />
                </div>
                <div class="form-group">
                    <label v-if="!validarAdmin" for="grupo" class="label">Grupo:</label>
                    <input v-if="!validarAdmin" type="text" id="grupo" v-model="user.grupo" class="form-control"
                        readonly />
                </div>
                <div class="form-group">
                    <label for="identificador" class="label">Identificador:</label>
                    <input type="text" id="identificador" v-model="user.usuario" class="form-control" readonly />
                </div>
                <div class="form-group">
                    <label v-if="!validarAdmin" for="puntos" class="label">Puntos:</label>
                    <input v-if="!validarAdmin" type="text" id="puntos" v-model="user.puntos" class="form-control"
                        readonly />
                </div>

                <div class="form-group">
                    <label for="contrasenaActual" class="label">Contraseña Actual:</label>
                    <input type="password" id="contrasenaActual" v-model="contrasenaActual" class="form-control"
                        required />
                </div>
                <div class="form-group">
                    <label for="nuevaContrasena" class="label">Nueva Contraseña:</label>
                    <input type="password" id="nuevaContrasena" v-model="nuevaContrasena" class="form-control"
                        required />
                </div>
                <div class="form-group">
                    <label for="confirmarContrasena" class="label">Confirmar Nueva Contraseña:</label>
                    <input type="password" id="confirmarContrasena" v-model="confirmarContrasena" class="form-control"
                        required />
                </div>
                <button @click="cambiarContrasena" class="btn-primary">Cambiar Contraseña</button>
            </div>
        </div>
    </BaseLayout>
</template>

<script>
import BaseLayout from '../layout/BaseLayout.vue';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import apiService from '../services/api.service';
import { validateJWT } from '../services/auth.pages';


export default {
    components: { BaseLayout },
    setup() {
        const user = ref({});
        const contrasenaActual = ref('');
        const nuevaContrasena = ref('');
        const confirmarContrasena = ref('');
        const toast = useToast();
        const storedUser = ref({}); // Guardar el usuario
        const validarAdmin = ref(false);
        validateJWT();

        onMounted(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                user.value = userData.user; // Guardar el objeto completo (usuario + token)
                storedUser.value = userData; // Guardar para uso interno
            } else {
                console.error("No se encontró el usuario en localStorage");
            }
        });

        // Función para cambiar la contraseña
        const cambiarContrasena = async () => {
            if (nuevaContrasena.value !== confirmarContrasena.value) {
                toast.error('Las contraseñas no coinciden.');
                return;
            }

            const passwordChangeData = {
                change: true,
                newPass: nuevaContrasena.value,
                oldPass: contrasenaActual.value,
            };

            try {
                // Realiza la llamada a la API para cambiar la contraseña
                if (validarAdmin.value) {
                    const response = await apiService.patch(`maestros/auth/changePassword/${user.value._id}`, passwordChangeData);
                } else {
                    const response = await apiService.patch(`/estudiantes/auth/changePassword/${user.value._id}`, passwordChangeData);
                }
                toast.success('Contraseña actualizada correctamente.');

                // Actualizar el valor de cambioContraseña en localStorage
                let updatedUser = { ...storedUser.value.user, cambioContrasena: true };
                localStorage.setItem('user', JSON.stringify({ user: updatedUser, token: storedUser.value.token }));

                // Limpiar los campos
                contrasenaActual.value = '';
                nuevaContrasena.value = '';
                confirmarContrasena.value = '';
            } catch (error) {
                console.error("Error en la actualización de contraseña:", error);
                if (error.response && error.response.status === 404) {
                    toast.error('Estudiante no encontrado.');
                } else if (error.response && error.response.data && error.response.data.message === 'La contraseña actual es incorrecta.') {
                    toast.error('La contraseña actual es incorrecta.');
                } else {
                    toast.error('Error al actualizar la contraseña.');
                }
            }
        };


        onMounted(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                user.value = userData.user;
                storedUser.value = userData;

                console.log('data ', userData.user);

                if ('isAdmin' in userData.user) {
                    console.log('isAdmin existe en el usuario');
                    validarAdmin.value = true;
                } else {
                    console.error('No se encontró la propiedad isAdmin en el usuario');
                }
            } else {
                console.error("No se encontró el usuario en localStorage");
            }
        });




        return {
            user,
            contrasenaActual,
            nuevaContrasena,
            confirmarContrasena,
            cambiarContrasena,
            validarAdmin,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
}

.title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
    font-family: Jomolhari;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.label {
    margin-bottom: 5px;
    font-size: 1.1rem;
    font-weight: bold;
}

.form-control {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 15px;
    font-size: 1rem;
}

.btn-primary {
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    background-color: #2E2B75;
    color: #fff;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #2e2b75e0;
}

@media (max-width: 768px) {
    .form {
        flex-direction: column;
    }
}
</style>
