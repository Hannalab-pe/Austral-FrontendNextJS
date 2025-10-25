'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditarVendedorForm, { EditarVendedorFormData } from '@/components/brokers/EditarVendedorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { brokersService, VendedorBroker } from '@/services/brokers.service';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

export default function EditarVendedorBrokerClient() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [vendedorData, setVendedorData] = useState<VendedorBroker | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const vendedorId = params.id as string;

  // Obtener datos del vendedor
  useEffect(() => {
    const fetchVendedorData = async () => {
      try {
        setLoadingData(true);

        // Validar que el usuario esté autenticado
        if (!user) {
          toast.error('No se pudo identificar el usuario autenticado');
          router.push('/broker/vendedores');
          return;
        }

        // Validar que el usuario sea un Broker
        const token = localStorage.getItem('auth-token');
        if (!token) {
          toast.error('No se encontró el token de autenticación');
          router.push('/broker/vendedores');
          return;
        }

        const decodedToken = authService.decodeToken(token);
        if (!decodedToken?.rol?.nombre || decodedToken.rol.nombre !== 'Broker') {
          toast.error('Solo los Brokers pueden editar vendedores');
          router.push('/broker/vendedores');
          return;
        }

        // Obtener lista de vendedores del broker
        const response = await brokersService.getMyVendedores();

        // Buscar el vendedor específico
        const vendedor = response.vendedores.find(v => v.idUsuario === vendedorId);

        if (!vendedor) {
          toast.error('Vendedor no encontrado o no tienes permisos para editarlo');
          router.push('/broker/vendedores');
          return;
        }

        setVendedorData(vendedor);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener datos del vendedor';
        toast.error('Error al cargar vendedor', {
          description: errorMessage,
        });
        console.error('Error obteniendo vendedor:', error);
        router.push('/broker/vendedores');
      } finally {
        setLoadingData(false);
      }
    };

    if (vendedorId) {
      fetchVendedorData();
    }
  }, [vendedorId, user, router]);

  const handleSubmit = async (data: EditarVendedorFormData) => {
    try {
      setIsLoading(true);

      // Validar que tengamos el ID del vendedor
      if (!vendedorId) {
        toast.error('ID del vendedor no encontrado');
        return;
      }

      // Llamar al endpoint de actualización de vendedores
      await brokersService.updateVendedor(vendedorId, data);
      toast.success('Vendedor actualizado exitosamente', {
        description: `Los cambios en ${data.nombreUsuario} han sido guardados.`,
      });

      // Redirigir a la lista de vendedores después de 1.5 segundos
      setTimeout(() => {
        router.push('/broker/vendedores');
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el vendedor';
      toast.error('Error al actualizar vendedor', {
        description: errorMessage,
      });
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
      router.push('/broker/vendedores');
    }
  };

  if (loadingData) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vendedorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendedor no encontrado</CardTitle>
          <CardDescription>
            El vendedor que intentas editar no existe o no tienes permisos para acceder a él.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/broker/vendedores')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/broker/vendedores')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Vendedor</h1>
          <p className="text-gray-600">
            Modifica la información editable de {vendedorData.nombre} {vendedorData.apellido}
          </p>
        </div>
      </div>

      {/* Información del vendedor */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">Editando Vendedor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800">
            <p>Solo puedes modificar el teléfono, nombre de usuario, email y porcentaje de comisión.</p>
            <p className="mt-1">Los demás campos están bloqueados por seguridad del sistema.</p>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Vendedor</CardTitle>
          <CardDescription>
            Modifica solo los campos permitidos. Los campos marcados con (*) son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditarVendedorForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            initialData={{
              nombreUsuario: vendedorData.nombreUsuario,
              email: vendedorData.email,
              telefono: vendedorData.telefono,
              porcentajeComision: vendedorData.porcentajeComision,
              nombre: vendedorData.nombre,
              apellido: vendedorData.apellido,
              documentoIdentidad: vendedorData.documentoIdentidad,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}