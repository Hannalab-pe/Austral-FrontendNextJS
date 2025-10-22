import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
    '/clientes',
    '/leads',
    '/polizas',
    '/siniestros',
    '/tareas',
    '/actividades',
    '/notificaciones',
    '/reportes',
    '/comisiones',
    '/peticiones',
    '/usuarios',
    '/asociados',
    '/configuracion',
    '/perfil',
    '/companias',
];

// Rutas de autenticación (públicas)
const authRoutes = ['/auth/login', '/auth/forgot-password', '/auth/register'];

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/register'];

/**
 * Decodificar token JWT sin validar firma
 * Solo para extraer información en el middleware
 */
function decodeToken(token: string): any {
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
        return null;
    }
}

/**
 * Verificar si el token ha expirado
 */
function isTokenExpired(token: string): boolean {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return true;

        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener token de las cookies
    const token = request.cookies.get('auth-token')?.value;

    // Verificar si la ruta es protegida
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Si está en una ruta protegida
    if (isProtectedRoute) {
        // Sin token, redirigir a login
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verificar si el token ha expirado
        if (isTokenExpired(token)) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            loginUrl.searchParams.set('expired', 'true');

            // Limpiar cookie del token expirado
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth-token');
            return response;
        }

        // Decodificar token para obtener información del usuario
        const decoded = decodeToken(token);

        if (!decoded) {
            const loginUrl = new URL('/auth/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Aquí puedes agregar validación de roles específicos por ruta
        // Por ejemplo:
        // if (pathname.startsWith('/usuarios') && decoded.id_rol !== 'admin-role-id') {
        //     return NextResponse.redirect(new URL('/unauthorized', request.url));
        // }

        // Agregar headers con información del usuario para uso en el cliente
        const response = NextResponse.next();
        response.headers.set('x-user-id', decoded.sub);
        response.headers.set('x-user-role', decoded.id_rol);
        return response;
    }

    // Si está en una ruta de autenticación y ya está autenticado
    if (isAuthRoute && token && !isTokenExpired(token)) {
        return NextResponse.redirect(new URL('/clientes', request.url));
    }

    // Redirigir root según estado de autenticación
    if (pathname === '/') {
        if (token && !isTokenExpired(token)) {
            return NextResponse.redirect(new URL('/clientes', request.url));
        } else {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

// Configurar qué rutas debe procesar el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};