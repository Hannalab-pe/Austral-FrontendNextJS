
import { NuevoVendedor } from '@/components/vendedores/forms/NuevoVendedor';

export const metadata = {
  title: 'Austral | Nuevo Vendedor',
  description: 'Crear un nuevo vendedor para el broker',
};

export default function NuevoVendedorPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Registrar nuevo vendedor</h2>
      <NuevoVendedor />
    </div>
  );
}