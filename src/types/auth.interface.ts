/**
 * Interfaces y tipos para el sistema de autenticación
 * Basado en el backend auth-service
 */

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
    idAsociado?: string;
    supervisorId?: string;
    estaActivo: boolean;
    ultimoAcceso?: string;
    fechaCreacion: string;
}

// Respuesta de autenticación
export interface AuthResponse {
    access_token: string;
    user: User;
}

// Payload del JWT decodificado
export interface JwtPayload {
    sub: string; // idUsuario
    email: string;
    nombreUsuario: string;
    nombreCompleto: string;
    idRol: string;
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
