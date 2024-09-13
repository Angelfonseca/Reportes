<template>
    <section class="dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center">
        <div class="flex flex-col items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
            <img class="w-1200 h-1200 mb-3" src="/Logo.png" alt="logo" />
            <span class="text-3xl font-bold">SIGERE</span>
        </div>
        <div
            class="bg-white shadow-lg rounded-lg border dark:bg-gray-800 dark:border-gray-700 max-w-md w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div class="p-8 space-y-6">
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"
                    v-if="hasError">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline"> Datos incorrectos, por favor revísalos.</span>
                    <button class="absolute top-0 bottom-0 right-0 px-4 py-3 focus:outline-none"
                        @click="hasError = false">
                        <svg class="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <title>Cerrar</title>
                            <path
                                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </button>
                </div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ingresa tus datos</h1>
                <form @submit.prevent="login" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            Usuario
                        </label>
                        <input v-model="form.username" type="text" name="username" id="username"
                            class="mt-1 block w-full bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="user98" required />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            Contraseña
                        </label>
                        <input v-model="form.password" type="password" name="password" id="password"
                            class="mt-1 block w-full bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••" required />
                    </div>
                    <button type="submit"
                    id="Btnlogin"
                        class="w-full text-white font-semibold rounded-lg py-2.5 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-300">
                        Ingresar
                    </button>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Olvidaste tu contraseña?
                        <a href="/consulta" class="text-blue-500 hover:underline">Olvidé mi contraseña</a>
                    </p>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
import { ref } from 'vue';
import router from '../router';
export default {
    name: 'LoginView',
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            hasError: false
        }
    },
}

</script>

<style scoped>
#Btnlogin {
    background-color: #2E2B75;
}

#Btnlogin:hover {
    background-color: #2e2b75e0;
}
</style>