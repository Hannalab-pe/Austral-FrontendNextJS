'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UsuarioForm from '@/components/usuarios/UsuarioForm';
import { UsuarioFormData } from '@/lib/schemas/usuario.schema';
import { Rol } from '@/types/usuario.interface';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useRoles } from '@/lib/hooks/useRoles';

interface NuevoUsuarioClientProps {
  rolesInitialData?: Rol[];
}

export default function NuevoUsuarioClient({ rolesInitialData }: NuevoUsuarioClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Usar el hook de roles con TanStack Query
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles(rolesInitialData);

  const handleSubmit = async (data: UsuarioFormData) => {
    try {
      setIsLoading(true);

      // Limpiar campos vacíos opcionales
      const cleanedData = {
        ...data,
        telefono: data.telefono || undefined,
        documento_identidad: data.documento_identidad || undefined,
        id_asociado: data.id_asociado || undefined,
        supervisor_id: data.supervisor_id || undefined,
      };

      // Llamar al endpoint de registro
      await authService.register(cleanedData);

      toast.success('Usuario registrado exitosamente');

      // Redirigir a la lista de usuarios después de 1 segundo
      setTimeout(() => {
        router.push('/usuarios');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar usuario');
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los datos no guardados se perderán.')) {
      router.push('/usuarios');
    }
  };

  if (isLoadingRoles) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/usuarios')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Usuario</h1>
          <p className="text-gray-600">Registra un nuevo usuario en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>
            Completa todos los campos requeridos (*) para registrar un nuevo usuario en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsuarioForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            roles={roles}
          />
        </CardContent>
      </Card>
    </div>
  );
}
