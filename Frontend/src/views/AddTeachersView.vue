<template>
    <BaseLayout>
        <div>
            <h1 class="title">Adición de Maestros</h1>
            <form class="form">
                <div class="form-group">
                    <label class="label" for="nombre">Nombre:</label>
                    <input class="form-control" type="text" id="nombre" v-model="teacher.nombre" />
                </div>
                <div class="form-group">
                    <label class="label" for="contrasena">Contraseña:</label>
                    <input class="form-control" type="password" id="contrasena" v-model="teacher.contrasena" />
                </div>
                <div class="form-group">
                    <label class="label" for="usuario">Identificador:</label>
                    <input class="form-control" type="text" id="usuario" v-model="teacher.usuario" />
                </div>
                <div class="form-group">
                    <label class="label" for="isAdmin">¿Es administrador?</label>
                    <input class="form-control" type="checkbox" id="isAdmin" v-model="teacher.isAdmin" />
                </div>
                <div class="form-actions">
                    <button class="btn-add-teacher" id="add_teacher" @click.prevent="addTeacher">Agregar
                        Maestro</button>
                </div>
            </form>
        </div>
    </BaseLayout>
</template>

<script>
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../services/api.service'
import { useToast } from 'vue-toast-notification';

export default {
    components: {
        BaseLayout
    },
    data() {
        return {
            teacher: {
                nombre: '',
                contrasena: '',
                usuario: '',
                isAdmin: false,
                nonAdmin: true
            }
        }
    },
    methods: {
        async addTeacher() {
            if (!this.teacher.nombre || !this.teacher.contrasena || !this.teacher.usuario) {
                this.$toast.open({
                    message: 'Por favor, llene todos los campos',
                    type: 'error'
                });
                return;
            }
            this.teacher.nonAdmin = !this.teacher.isAdmin;

            try {
                const response = await apiService.post('maestros/', this.teacher);

                if (response && response._id) {
                    this.$toast.open({
                        message: 'Maestro agregado correctamente',
                        type: 'success'
                    });
                    this.clearForm();
                } else {
                    this.$toast.open({
                        message: 'Error al agregar maestro: Respuesta inesperada',
                        type: 'error'
                    });
                    console.log(response);
                }
            } catch (error) {
                this.$toast.open({
                    message: 'Error al agregar maestro: ' + error.message,
                    type: 'error'
                });
                console.error(error);
            }
        },
        clearForm() {
            this.teacher = {
                nombre: '',
                contrasena: '',
                usuario: '',
                isAdmin: false,
                nonAdmin: true
            }
        },
    }

}

</script>

<style>
.title {
    text-align: center;
    font-size: 4rem;
    margin-bottom: 20px;
    font-family: Jomolhari;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 600px;
    margin: 0 auto;
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

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn-add-teacher {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 1.1rem;
    display: block;
    margin: 0 auto;
}
</style>
