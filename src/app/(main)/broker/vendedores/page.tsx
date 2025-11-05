import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VendedoresTable from '@/components/vendedores/tables/VendedoresTable';

export const metadata = {
  title: 'Austral | Vendedores',
  description: 'Gestión de vendedores para brokers',
};

export default function VendedoresPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza los vendedores asociados a tu broker
          </p>
        </div>
        <Button asChild variant="new">
          <Link href="/broker/vendedores/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Vendedor
          </Link>
        </Button>
      </div>

      {/* Tabla de vendedores */}
      <VendedoresTable />
    </div>
  );
}
