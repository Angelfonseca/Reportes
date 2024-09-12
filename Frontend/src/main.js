import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ToastPlugin from 'vue-toast-notification';
import router from './router/index.js';
import './assets/main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
// Declarar app con const
const app = createApp(App)
app.use(router)
app.mount('#app')
app.use(ToastPlugin);