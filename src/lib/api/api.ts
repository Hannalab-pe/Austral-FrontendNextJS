import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types/auth.interface';

// Configuración de la URL base de la API
// NOTA: Actualmente apunta directamente al Auth Service (puerto 3001)
// Cuando el API Gateway esté implementado, cambiar a puerto 3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Instancia principal de Axios con configuración global
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para enviar cookies
});

/**
 * Interceptor para agregar el token JWT a las peticiones
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor para manejar errores de respuesta
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        // Si el token expiró o es inválido, limpiar el almacenamiento
        if (error.response?.status === 401) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-user');

            // Redirigir al login si no está ya en esa página
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Crear instancias específicas para diferentes servicios
 */
export const createServiceClient = (servicePath: string): AxiosInstance => {
    return axios.create({
        baseURL: `${API_URL}${servicePath}`,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
};

// Exportar la URL base para uso en otros lugares
export { API_URL };
