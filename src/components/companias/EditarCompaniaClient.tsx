'use client';

import { useCompania, useUpdateCompania } from '@/lib/hooks/useCompanias';
import { type CompaniaFormData } from '@/lib/schemas/compania.schema';
import CompaniaForm from './CompaniaForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditarCompaniaClientProps {
  id: string;
}

export default function EditarCompaniaClient({ id }: EditarCompaniaClientProps) {
  const router = useRouter();
  const { data: compania, isLoading, isError, error } = useCompania(id);
  const updateCompaniaMutation = useUpdateCompania();

  const handleSubmit = async (data: CompaniaFormData) => {
    try {
      await updateCompaniaMutation.mutateAsync({ id, data });
      toast.success('Compañía actualizada exitosamente');
      router.push('/companias');
    } catch (error: any) {
      console.error('Error al actualizar compañía:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Error al actualizar la compañía';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/companias');
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl">
        <Link href="/companias">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Button>
        </Link>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-gray-600">Cargando información de la compañía...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de error
  if (isError || !compania) {
    return (
      <div className="container mx-auto max-w-5xl">
        <Link href="/companias">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'No se pudo cargar la información de la compañía'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/companias')} variant="outline">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  // Preparar datos iniciales para el formulario
  const initialData: CompaniaFormData = {
    nombre: compania.nombre,
    razonSocial: compania.razonSocial || '',
    ruc: compania.ruc || '',
    direccion: compania.direccion || '',
    telefono: compania.telefono || '',
    email: compania.email || '',
    sitioWeb: compania.sitioWeb || '',
    contactoPrincipal: compania.contactoPrincipal || '',
    telefonoContacto: compania.telefonoContacto || '',
    emailContacto: compania.emailContacto || '',
  };

  return (
    <div className="container mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/companias">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Compañía de Seguros
            </h1>
            <p className="text-gray-600 mt-1">
              Actualiza la información de <span className="font-semibold">{compania.nombre}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <CompaniaForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isLoading={updateCompaniaMutation.isPending}
        onCancel={handleCancel}
      />
    </div>
  );
}
