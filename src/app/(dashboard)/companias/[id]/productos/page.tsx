import { Metadata } from 'next';
import ProductosCompaniaClient from '@/components/productos/ProductosCompaniaClient';

export const metadata: Metadata = {
  title: 'Productos de Compañía | CRM Austral',
  description: 'Gestión de productos de seguros por compañía',
};

interface ProductosCompaniaPageProps {
  params: {
    id: string;
  };
}

export default function ProductosCompaniaPage({
  params,
}: ProductosCompaniaPageProps) {
  return <ProductosCompaniaClient idCompania={params.id} />;
}
