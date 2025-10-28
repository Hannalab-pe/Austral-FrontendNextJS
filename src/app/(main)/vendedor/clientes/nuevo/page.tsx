
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RegistrarCliente from '@/components/clientes/forms/RegistrarCliente';

export const metadata = {
 title: 'Nuevo Cliente',
 description: 'Crear un nuevo cliente como vendedor',
};

export default function NuevoClientePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/vendedor/clientes">
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
            <p className="text-muted-foreground">
              Registra un nuevo cliente en tu cartera
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de registro */}
      <RegistrarCliente />
    </div>
  );
}