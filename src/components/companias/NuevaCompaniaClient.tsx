'use client';

import { useCreateCompania } from '@/lib/hooks/useCompanias';
import { type CompaniaFormData } from '@/lib/schemas/compania.schema';
import CompaniaForm from './CompaniaForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NuevaCompaniaClient() {
  const router = useRouter();
  const createCompaniaMutation = useCreateCompania();

  const handleSubmit = async (data: CompaniaFormData) => {
    try {
      await createCompaniaMutation.mutateAsync(data);
      toast.success('Compañía creada exitosamente');
      router.push('/admin/companias');
    } catch (error: any) {
      console.error('Error al crear compañía:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Error al crear la compañía';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/admin/companias');
  };

  return (
    <div className="container mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/companias">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Building2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Nueva Compañía de Seguros
            </h1>
            <p className="text-gray-600 mt-1">
              Registra una nueva compañía aseguradora en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <CompaniaForm
        onSubmit={handleSubmit}
        isLoading={createCompaniaMutation.isPending}
        onCancel={handleCancel}
      />
    </div>
  );
}
