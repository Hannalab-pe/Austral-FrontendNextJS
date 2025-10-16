import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types/auth.interface';

// ============================================================================
// CONFIGURACIÓN DE URLS DE MICROSERVICIOS
// ============================================================================

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const LEADS_SERVICE_URL = process.env.NEXT_PUBLIC_LEADS_SERVICE_URL || 'http://localhost:3002';
const PRODUCTS_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCTOS_SERVICE_URL || 'http://localhost:3004';

// ============================================================================
// FUNCIÓN PARA CREAR INSTANCIAS DE AXIOS CON INTERCEPTORES
// ============================================================================

/**
 * Crea una instancia de Axios con interceptores configurados
 * @param baseURL - URL base del microservicio
 * @returns Instancia de Axios configurada
 */
const createAxiosInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Para enviar cookies
    });

    // Interceptor para agregar el token JWT a las peticiones
    instance.interceptors.request.use(
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

    // Interceptor para manejar errores de respuesta
    instance.interceptors.response.use(
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

    return instance;
};

// ============================================================================
// INSTANCIAS DE AXIOS POR MICROSERVICIO
// ============================================================================

/**
 * Cliente para Auth Service (puerto 3001)
 * Usado para: autenticación, usuarios, roles
 */
export const apiClient: AxiosInstance = createAxiosInstance(AUTH_SERVICE_URL);

/**
 * Cliente para Leads Service (puerto 3002)
 * Usado para: leads, estados de leads, fuentes de leads
 */
export const leadsClient: AxiosInstance = createAxiosInstance(LEADS_SERVICE_URL);

/**
 * Cliente para Products Service (puerto 3004)
 * Usado para: compañías de seguros, tipos de seguros, productos de seguros
 */
export const productsClient: AxiosInstance = createAxiosInstance(PRODUCTS_SERVICE_URL);

// ============================================================================
// EXPORTACIONES LEGACY (mantener compatibilidad)
// ============================================================================

/**
 * @deprecated Use apiClient, leadsClient, o productsClient según el servicio
 */
export const API_URL = AUTH_SERVICE_URL;

/**
 * @deprecated Use createAxiosInstance directamente
 */
export const createServiceClient = (servicePath: string): AxiosInstance => {
    return axios.create({
        baseURL: `${AUTH_SERVICE_URL}${servicePath}`,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
};
