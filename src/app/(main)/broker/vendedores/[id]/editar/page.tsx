import EditarVendedor from '@/components/vendedores/forms/EditarVendedor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Austral | Editar Vendedor',
  description: 'Editar información del vendedor',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditarVendedorPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Vendedor</h1>
          <p className="text-muted-foreground">
            Actualiza la información de comisión y contacto del vendedor
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/broker/vendedores/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Detalles
          </Link>
        </Button>
      </div>

      {/* Componente de edición */}
      <EditarVendedor idVendedor={params.id} />
    </div>
  );
}
