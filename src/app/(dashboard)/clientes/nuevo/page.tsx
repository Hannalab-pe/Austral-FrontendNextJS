'use client';

import { useRouter } from 'next/navigation';
import ClienteForm from '@/components/clientes/ClienteForm';
import { ClienteFormData } from '@/lib/schemas/cliente.schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NuevoClientePage() {
  const router = useRouter();

  const handleSubmit = (data: ClienteFormData) => {
    // TODO: Implementar llamada a API para crear cliente
    console.log('Datos del nuevo cliente:', data);
    
    // Simulación de creación exitosa
    toast.success('Cliente registrado exitosamente');
    
    // Redirigir a la lista de clientes después de 1 segundo
    setTimeout(() => {
      router.push('/clientes');
    }, 1000);
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los datos no guardados se perderán.')) {
      router.push('/clientes');
    }
  };

  return (
    <div className="space-y-6">
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
            isLoading={false} 
          />
        </CardContent>
      </Card>
    </div>
  );
}