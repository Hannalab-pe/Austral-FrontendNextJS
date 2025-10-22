// lib/permissions/server-checks.ts
import { cookies } from 'next/headers';

// Función para verificar acceso a vistas en Server Components
export async function checkViewAccess(requiredRoute: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) return false;

        // Aquí iría la llamada a tu API de permisos
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permisos/verificar-vista`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ruta: requiredRoute })
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data.tiene_acceso;
    } catch (error) {
        console.error('Error verificando acceso:', error);
        return false;
    }
}

// Función para verificar permisos específicos en Server Components
export async function checkPermission(vista: string, permiso: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) return false;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permisos/verificar-permiso`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vista, permiso })
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data.tiene_permiso;
    } catch (error) {
        console.error('Error verificando permiso:', error);
        return false;
    }
}