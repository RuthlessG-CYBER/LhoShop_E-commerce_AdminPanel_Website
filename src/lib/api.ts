import axios from 'axios';
import { toast } from 'sonner';

export const BASE_URL = 'http://localhost:4040/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle session expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            toast.error('Session Expired', {
                description: 'You will be redirected to the login page in 5 seconds.',
                duration: 5000,
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAuthenticated');

            setTimeout(() => {
                window.location.href = '/login';
            }, 5000);
        }
        return Promise.reject(error);
    }
);

export default api;