import { Metadata } from 'next';
import EditarCompaniaClient from '@/components/companias/EditarCompaniaClient';

export const metadata: Metadata = {
  title: 'Editar Compañía | CRM Austral',
  description: 'Editar información de compañía de seguros',
};

interface EditarCompaniaPageProps {
  params: {
    id: string;
  };
}

export default function EditarCompaniaPage({ params }: EditarCompaniaPageProps) {
  return <EditarCompaniaClient id={params.id} />;
}
