# Ejemplos de Uso - Sistema de Permisos

Este documento muestra cómo usar los hooks de permisos en componentes reales del frontend.

## 1. Proteger un botón de "Nuevo" en una lista

```tsx
// components/usuarios/UsuariosList.tsx
'use client';

import { useCanCreate } from '@/lib/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UsuariosList() {
  const router = useRouter();
  const { canAccess: canCreateUser, loading } = useCanCreate('/usuarios');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Usuarios</h1>
        {canCreateUser && (
          <Button onClick={() => router.push('/usuarios/nuevo')}>
            Nuevo Usuario
          </Button>
        )}
      </div>

      <UsuariosTable />
    </div>
  );
}
```

## 2. Proteger acciones en una tabla

```tsx
// components/usuarios/UsuariosTable.tsx
'use client';

import { usePermissions } from '@/lib/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

export default function UsuariosTable({ usuarios, onEdit, onDelete }: UsuariosTableProps) {
  const { canUpdate, canDelete } = usePermissions();

  const handleEdit = async (usuario: Usuario) => {
    const canEdit = await canUpdate('/usuarios');
    if (canEdit) {
      onEdit(usuario);
    }
  };

  const handleDelete = async (usuario: Usuario) => {
    const canRemove = await canDelete('/usuarios');
    if (canRemove) {
      onDelete(usuario);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id_usuario}>
            <td>{usuario.nombre}</td>
            <td>{usuario.email}</td>
            <td>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(usuario)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(usuario)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 3. Proteger una vista completa (Server Component)

```tsx
// app/(dashboard)/companias/page.tsx
import { redirect } from 'next/navigation';
import { checkViewAccess } from '@/lib/permissions/server-checks';
import CompaniasClient from '@/components/companias/CompaniasClient';

export default async function CompaniasPage() {
  // Verificar acceso a la vista en el servidor
  const hasAccess = await checkViewAccess('/companias');

  if (!hasAccess) {
    redirect('/unauthorized');
  }

  return <CompaniasClient />;
}
```

## 4. Proteger rutas dinámicas

```tsx
// app/(dashboard)/companias/[id]/editar/page.tsx
import { redirect } from 'next/navigation';
import { checkViewAccess } from '@/lib/permissions/server-checks';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCompaniaPage({ params }: PageProps) {
  const { id } = await params;

  // Verificar acceso a rutas dinámicas con wildcard
  const hasAccess = await checkViewAccess('/companias/*/editar');

  if (!hasAccess) {
    redirect('/unauthorized');
  }

  return <EditarCompaniaClient companiaId={id} />;
}
```

## 5. Usar múltiples permisos a la vez

```tsx
// components/companias/CompaniaActions.tsx
'use client';

import { usePermissions } from '@/lib/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CompaniaActionsProps {
  companiaId: string;
}

export default function CompaniaActions({ companiaId }: CompaniaActionsProps) {
  const router = useRouter();
  const { hasMultiplePermissions } = usePermissions();

  const [canEdit, canDelete, canViewProducts] = await hasMultiplePermissions([
    { vista: '/companias/*/editar', permiso: 'actualizar' },
    { vista: '/companias/*/editar', permiso: 'eliminar' },
    { vista: '/companias/*/productos', permiso: 'leer' }
  ]);

  return (
    <div className="flex gap-2">
      {canEdit && (
        <Button onClick={() => router.push(`/companias/${companiaId}/editar`)}>
          Editar
        </Button>
      )}

      {canViewProducts && (
        <Button onClick={() => router.push(`/companias/${companiaId}/productos`)}>
          Ver Productos
        </Button>
      )}

      {canDelete && (
        <Button variant="destructive" onClick={() => handleDelete(companiaId)}>
          Eliminar
        </Button>
      )}
    </div>
  );
}
```

## 6. Componente protegido reutilizable

```tsx
// components/common/ProtectedButton.tsx
'use client';

import { useProtectedComponent } from '@/lib/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProtectedButtonProps {
  permission: { vista: string; permiso: string };
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
}

export default function ProtectedButton({
  permission,
  onClick,
  children,
  variant = 'default',
  disabled = false
}: ProtectedButtonProps) {
  const { hasAccess, loading } = useProtectedComponent(permission);

  if (loading) {
    return (
      <Button variant={variant} disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Cargando...
      </Button>
    );
  }

  if (!hasAccess) {
    return null; // No mostrar el botón si no tiene permisos
  }

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

// Uso del componente protegido:
<ProtectedButton
  permission={{ vista: '/usuarios', permiso: 'crear' }}
  onClick={() => router.push('/usuarios/nuevo')}
>
  Nuevo Usuario
</ProtectedButton>
```

## 7. Middleware para protección de rutas

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verificarRuta } from '@/services/permisos.service';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren verificación
  const publicRoutes = ['/login', '/unauthorized', '/api/auth'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Obtener token del usuario (desde cookies o headers)
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar acceso a la ruta
    const hasAccess = await verificarRuta({
      ruta: pathname,
      token: token
    });

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error en middleware de permisos:', error);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 8. Hook personalizado para dashboards

```tsx
// lib/hooks/useDashboardPermissions.ts
'use client';

import { usePermissions } from '@/lib/hooks/usePermissions';

export function useDashboardPermissions() {
  const { hasMultiplePermissions } = usePermissions();

  const checkDashboardAccess = async () => {
    const permissions = await hasMultiplePermissions([
      { vista: '/dashboard', permiso: 'leer' },
      { vista: '/usuarios', permiso: 'leer' },
      { vista: '/companias', permiso: 'leer' },
      { vista: '/productos', permiso: 'leer' }
    ]);

    return {
      canViewDashboard: permissions[0],
      canViewUsers: permissions[1],
      canViewCompanies: permissions[2],
      canViewProducts: permissions[3]
    };
  };

  return { checkDashboardAccess };
}
```

## Notas Importantes

1. **Wildcards en rutas**: Usa `*` para rutas dinámicas como `/companias/*/editar`
2. **Server vs Client**: Los Server Components pueden verificar permisos en el servidor usando `checkViewAccess`
3. **Loading states**: Siempre maneja estados de carga para una mejor UX
4. **Componentes reutilizables**: Crea componentes como `ProtectedButton` para consistencia
5. **Middleware**: Usa middleware para protección global de rutas
6. **Múltiples permisos**: Usa `hasMultiplePermissions` para verificar varios permisos eficientemente
