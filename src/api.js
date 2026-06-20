import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://serverusers-87tl.onrender.com/api';

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function getApiErrorMessage(err, fallback = 'Ошибка сервера') {
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return fallback;
}
