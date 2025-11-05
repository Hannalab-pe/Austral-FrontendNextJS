
import VerVendedor from '@/components/vendedores/VerVendedor';

export const metadata = {
  title: 'Austral | Ver Vendedor',
  description: 'Detalles del vendedor',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function VerVendedorPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalle del Vendedor</h1>
        <p className="text-muted-foreground">
          Visualiza la información completa del vendedor
        </p>
      </div>

      {/* Componente de detalle */}
      <VerVendedor idVendedor={params.id} />
    </div>
  );
}
