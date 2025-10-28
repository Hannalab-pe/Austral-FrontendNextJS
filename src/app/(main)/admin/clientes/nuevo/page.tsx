'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ClienteForm from '@/components/clientes/ClienteForm';
import { ClienteFormData } from '@/lib/schemas/cliente.schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clientesService } from '@/services/clientes.service';

export default function NuevoClientePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      setIsLoading(true);
      console.log('📋 Formulario completado - Datos recibidos:', data);
      console.log('📤 Tipo de fechaNacimiento:', typeof data.fechaNacimiento);
      console.log('📤 Valor de fechaNacimiento:', data.fechaNacimiento);
      
      // Llamada real a la API
      console.log('🚀 Iniciando petición POST a /clientes...');
      const nuevoCliente = await clientesService.create(data);
      
      console.log('✅ Cliente creado exitosamente:', nuevoCliente);
      console.log('✅ ID del nuevo cliente:', nuevoCliente.idCliente);
      toast.success(`Cliente ${nuevoCliente.nombre} ${nuevoCliente.apellido} registrado exitosamente`);
      
      // Redirigir a la lista de clientes
      setTimeout(() => {
        router.push('/clientes');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error al crear cliente:', error);
      console.error('❌ Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar el cliente';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los datos no guardados se perderán.')) {
      router.push('/clientes');
    }
  };

  return (
    <div className="space-y-6 container mx-auto max-w-5xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/clientes')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
          <p className="text-gray-600">Registra la información del nuevo cliente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>
            Completa todos los campos requeridos (*) para registrar un nuevo cliente en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}