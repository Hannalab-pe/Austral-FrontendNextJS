import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
    '/admin/dashboard',
    '/broker/dashboard',
    '/vendedor/dashboard',
];

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/forgot-password', '/register'];

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
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Si está en una ruta protegida
    if (isProtectedRoute) {
        // Sin token, redirigir a login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verificar si el token ha expirado
        if (isTokenExpired(token)) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            loginUrl.searchParams.set('expired', 'true');

            // Limpiar cookie del token expirado
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth-token');
            return response;
        }

        // Token válido, permitir acceso
        return NextResponse.next();
    }

    // Si está en una ruta pública y tiene token válido, permitir acceso
    if (isPublicRoute && token && !isTokenExpired(token)) {
        // Permitir que el frontend maneje la redirección
        return NextResponse.next();
    }

    // Para cualquier otra ruta, continuar normalmente
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
