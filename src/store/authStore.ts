import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import {
    User,
    LoginDto,
    RegisterDto,
    ChangePasswordDto,
    UserProfile,
    AuthStore,
} from '@/types/auth.interface';
import { toast } from 'sonner';

/**
 * Store de autenticación con Zustand
 * Incluye persistencia en localStorage
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Estado inicial
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            /**
             * Iniciar sesión
             */
            login: async (credentials: LoginDto) => {
                try {
                    set({ isLoading: true });

                    const response = await authService.login(credentials);

                    // Guardar token en localStorage y cookies
                    localStorage.setItem('auth-token', response.access_token);
                    document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400`; // 24 horas

                    // Actualizar estado
                    set({
                        user: response.user,
                        token: response.access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    toast.success('Sesión iniciada', {
                        description: `Bienvenido ${response.user.nombre} ${response.user.apellido}`,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
                    toast.error('Error de autenticación', {
                        description: message,
                    });
                    throw error;
                }
            },

            /**
             * Registrar nuevo usuario
             */
            register: async (data: RegisterDto) => {
                try {
                    set({ isLoading: true });

                    const response = await authService.register(data);

                    // Guardar token en localStorage y cookies
                    localStorage.setItem('auth-token', response.access_token);
                    document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400`;

                    // Actualizar estado
                    set({
                        user: response.user,
                        token: response.access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    toast.success('Registro exitoso', {
                        description: `Bienvenido ${response.user.nombre}`,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    const message = error instanceof Error ? error.message : 'Error al registrar usuario';
                    toast.error('Error de registro', {
                        description: message,
                    });
                    throw error;
                }
            },

            /**
             * Cerrar sesión
             */
            logout: () => {
                // Limpiar localStorage
                localStorage.removeItem('auth-token');
                localStorage.removeItem('auth-user');

                // Limpiar cookies
                document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

                // Resetear estado
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });

                toast.info('Sesión cerrada', {
                    description: 'Has cerrado sesión exitosamente',
                });
            },

            /**
             * Establecer usuario manualmente
             */
            setUser: (user: User | null) => {
                set({ user, isAuthenticated: !!user });
            },

            /**
             * Establecer token manualmente
             */
            setToken: (token: string | null) => {
                set({ token, isAuthenticated: !!token });
                if (token) {
                    localStorage.setItem('auth-token', token);
                    document.cookie = `auth-token=${token}; path=/; max-age=86400`;
                } else {
                    localStorage.removeItem('auth-token');
                    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }
            },

            /**
             * Verificar autenticación al cargar la app
             */
            checkAuth: async () => {
                try {
                    const token = localStorage.getItem('auth-token');

                    if (!token) {
                        set({ isAuthenticated: false, user: null, token: null });
                        return;
                    }

                    // Verificar si el token ha expirado
                    if (authService.isTokenExpired(token)) {
                        get().logout();
                        return;
                    }

                    // Validar token con el backend
                    const isValid = await authService.validateToken();

                    if (!isValid) {
                        get().logout();
                        return;
                    }

                    // Si el token es válido pero no tenemos usuario, obtener perfil
                    if (!get().user) {
                        const userProfile = await authService.getUserProfile();
                        set({
                            user: {
                                id_usuario: userProfile.id_usuario,
                                nombre_usuario: userProfile.nombre_usuario,
                                email: userProfile.email,
                                nombre: userProfile.nombre,
                                apellido: userProfile.apellido,
                                id_rol: userProfile.id_rol,
                            },
                            token,
                            isAuthenticated: true,
                        });
                    } else {
                        set({ token, isAuthenticated: true });
                    }
                } catch (error) {
                    console.error('Error verificando autenticación:', error);
                    get().logout();
                }
            },

            /**
             * Obtener perfil completo del usuario
             */
            getUserProfile: async (): Promise<UserProfile> => {
                try {
                    const profile = await authService.getUserProfile();

                    // Actualizar usuario en el estado
                    set({
                        user: {
                            id_usuario: profile.id_usuario,
                            nombre_usuario: profile.nombre_usuario,
                            email: profile.email,
                            nombre: profile.nombre,
                            apellido: profile.apellido,
                            id_rol: profile.id_rol,
                        },
                    });

                    return profile;
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error al obtener perfil';
                    toast.error('Error', { description: message });
                    throw error;
                }
            },

            /**
             * Cambiar contraseña
             */
            changePassword: async (data: ChangePasswordDto) => {
                try {
                    await authService.changePassword(data);
                    toast.success('Contraseña actualizada', {
                        description: 'Tu contraseña ha sido cambiada exitosamente',
                    });
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error al cambiar contraseña';
                    toast.error('Error', { description: message });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
