/**
 * Interfaces y tipos para el sistema de autenticación
 * Basado en el backend auth-service
 */

import { Rol } from './usuario.interface';

// DTOs de Login y Registro
export interface LoginDto {
    usuario: string; // Puede ser email o nombre de usuario
    contrasena: string;
}

export interface RegisterDto {
    nombreUsuario: string;
    email: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    idRol: string;
}

export interface ChangePasswordDto {
    contrasenaActual: string;
    contrasenaNueva: string;
}

export interface CreateVendedorDto {
    nombreUsuario: string;
    email: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    porcentajeComision: number;
}

// Usuario (info básica)
export interface User {
    idUsuario: string;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
    idRol: string;
}

// Usuario completo (con más detalles)
export interface UserProfile extends User {
    telefono?: string;
    documentoIdentidad?: string;
    estaActivo: boolean;
    ultimoAcceso?: string;
    fechaCreacion: string;
    rol?: Rol;
}

// Respuesta de autenticación
export interface AuthResponse {
    access_token: string;
    user: User;
}

// Respuesta de crear vendedor
export interface CreateVendedorResponse {
    vendedor: User;
    brokerVendedor: {
        idBroker: string;
        idVendedor: string;
        porcentajeComision: number;
        fechaAsignacion: string;
    };
}

// Payload del JWT decodificado
export interface JwtPayload {
    sub: string; // idUsuario
    email: string;
    nombreUsuario: string;
    nombreCompleto: string;
    idRol: string;
    rol?: {
        idRol: string;
        nombre: string;
        descripcion?: string;
    };
    iat?: number; // issued at
    exp?: number; // expiration
}

// Estado de autenticación en el store
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Acciones del store
export interface AuthActions {
    login: (credentials: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    checkAuth: () => Promise<void>;
    getUserProfile: () => Promise<UserProfile>;
    changePassword: (data: ChangePasswordDto) => Promise<void>;
}

// Store completo
export type AuthStore = AuthState & AuthActions;

// Respuesta de error de la API
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
