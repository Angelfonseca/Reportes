import axios from 'axios';

// const url = 'http://localhost:5000/';
const url = 'http://192.168.100.8:5000/';
const api = axios.create({
    baseURL: `${url}api`
});

api.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('user');
        if (token && token.token) {
            config.headers.Authorization = `${token.token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export { api, url }; 
