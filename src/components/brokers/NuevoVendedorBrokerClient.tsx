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

export default function NuevoVendedorBrokerClient() {
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

      // Validar que el usuario sea un Broker (doble validación)
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

      toast.success('Vendedor registrado exitosamente', {
        description: `${data.nombre} ${data.apellido} ha sido registrado con ${data.porcentajeComision}% de comisión.`,
      });

      // Redirigir a la lista de vendedores después de 1.5 segundos
      setTimeout(() => {
        router.push('/brokers/vendedores');
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo registrar el vendedor';
      toast.error('Error al registrar vendedor', {
        description: errorMessage,
      });
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los datos no guardados se perderán.')) {
      router.push('/brokers/vendedores');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/brokers/vendedores')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Registrar Nuevo Vendedor</h1>
          <p className="text-gray-600">Agrega un nuevo vendedor a tu equipo y asigna su porcentaje de comisión</p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Nuevo Vendedor</CardTitle>
          <CardDescription>
            Completa toda la información requerida. Los campos marcados con (*) son obligatorios.
            El vendedor podrá acceder al sistema inmediatamente después del registro.
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