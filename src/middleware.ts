import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
    '/dashboard',
    '/actividades',
    '/asociados',
    '/clientes',
    '/comisiones',
    '/configuracion',
    '/leads',
    '/notificaciones',
    '/perfil',
    '/peticiones',
    '/polizas',
    '/reportes',
    '/siniestros',
    '/tareas',
    '/usuarios'
];

// Rutas de autenticación
const authRoutes = ['/login', '/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener token de las cookies (implementación básica)
    const token = request.cookies.get('auth-token')?.value;

    // Si está en una ruta protegida y no tiene token, redirigir a login
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Si está autenticado y trata de acceder a rutas de auth, redirigir al dashboard
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Redirigir root a dashboard si está autenticado, sino a login
    if (pathname === '/') {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
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