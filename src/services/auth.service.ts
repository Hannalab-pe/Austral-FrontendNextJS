import axios from 'axios';
import { apiClient } from '@/lib/api/api';
import {
    LoginDto,
    RegisterDto,
    ChangePasswordDto,
    AuthResponse,
    UserProfile,
    CreateVendedorDto,
    CreateVendedorResponse,
    JwtPayload,
} from '@/types/auth.interface';

/**
 * Servicio de autenticación
 */
export const authService = {
    /**
     * Iniciar sesión
     */
    async login(credentials: LoginDto): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al iniciar sesión');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Registrar nuevo usuario
     */
    async register(data: RegisterDto): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al registrar usuario');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener perfil del usuario actual
     */
    async getUserProfile(): Promise<UserProfile> {
        try {
            const response = await apiClient.get<UserProfile>('/auth/profile');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener perfil');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Cambiar contraseña
     */
    async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
        try {
            const response = await apiClient.post('/auth/change-password', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al cambiar contraseña');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Crear vendedor (solo para Brokers)
     */
    async createVendedor(data: CreateVendedorDto): Promise<CreateVendedorResponse> {
        try {
            const response = await apiClient.post<CreateVendedorResponse>('/auth/create-vendedor', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al crear vendedor');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Validar token actual
     */
    async validateToken(): Promise<boolean> {
        try {
            await apiClient.get('/auth/validate');
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Decodificar token JWT (sin validar firma)
     * Solo para uso en el cliente para extraer información
     */
    decodeToken(token: string): JwtPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decodificando token:', error);
            return null;
        }
    },

    /**
     * Verificar si el token ha expirado
     */
    isTokenExpired(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) return true;

            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    },
};
