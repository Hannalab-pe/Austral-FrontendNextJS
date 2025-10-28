'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VendedorForm from '@/components/usuarios/VendedorForm';
import { VendedorFormData } from '@/lib/schemas/vendedor.schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

export default function NuevoVendedorClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (data: VendedorFormData) => {
    try {
      setIsLoading(true);

      // Validar que el usuario esté autenticado
      if (!user) {
        toast.error('No se pudo identificar el usuario autenticado');
        setIsLoading(false);
        return;
      }

      // Validar que el usuario sea un Broker
      // Decodificar el token para obtener información del rol
      const token = localStorage.getItem('auth-token');
      if (!token) {
        toast.error('No se encontró el token de autenticación');
        setIsLoading(false);
        return;
      }

      const decodedToken = authService.decodeToken(token);
      if (!decodedToken?.rol?.nombre || decodedToken.rol.nombre !== 'Broker') {
        toast.error('Solo los Brokers pueden crear Vendedores');
        setIsLoading(false);
        return;
      }

      // Limpiar campos vacíos opcionales
      const cleanedData = {
        ...data,
        telefono: data.telefono || undefined,
        documentoIdentidad: data.documentoIdentidad || undefined,
      };

      // Llamar al endpoint de creación de vendedores
      await authService.createVendedor(cleanedData);

      toast.success('Vendedor creado exitosamente', {
        description: `El vendedor ${data.nombre} ${data.apellido} ha sido registrado y asignado a tu cuenta.`,
      });

      // Redirigir a la lista de vendedores después de 1 segundo
      setTimeout(() => {
        router.push('/dashboard'); // TODO: Crear la ruta de vendedores
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo crear el vendedor';
      toast.error('Error al crear vendedor', {
        description: errorMessage,
      });
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los datos no guardados se perderán.')) {
      router.push('/dashboard'); // TODO: Definir la ruta correcta
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Vendedor</h1>
          <p className="text-gray-600">Registra un nuevo vendedor y asigna su porcentaje de comisión</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Vendedor</CardTitle>
          <CardDescription>
            Completa todos los campos requeridos (*) para registrar un nuevo vendedor en el sistema.
            El vendedor será automáticamente asignado a tu cuenta como Broker.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendedorForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}