import { Metadata } from 'next';
import NuevaCompaniaClient from '@/components/companias/NuevaCompaniaClient';

export const metadata: Metadata = {
  title: 'Nueva Compañía | CRM Austral',
  description: 'Registrar nueva compañía de seguros',
};

export default function NuevaCompaniaPage() {
  return <NuevaCompaniaClient />;
}
