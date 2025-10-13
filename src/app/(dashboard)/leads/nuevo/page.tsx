'use client';

import { useRouter } from 'next/navigation';
import LeadForm from '@/components/leads/LeadForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MOCK_ESTADOS_LEAD } from '@/lib/constants/mock-estados-lead';
import { MOCK_FUENTES_LEAD } from '@/lib/constants/mock-fuentes-lead';
import type { LeadFormData } from '@/lib/schemas/lead.schema';
import { toast } from 'sonner';

export default function NuevoLeadPage() {
  const router = useRouter();

  const handleSubmit = (data: LeadFormData) => {
    console.log('Nuevo lead:', data);
    
    // Aquí se haría la llamada a la API para crear el lead
    toast.success('Lead registrado exitosamente', {
      description: `${data.nombre} ${data.apellido || ''} ha sido agregado al sistema`,
    });

    // Redirigir a la lista de leads
    setTimeout(() => {
      router.push('/leads');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/leads');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Lead</h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva oportunidad de negocio
          </p>
        </div>
      </div>

      {/* Formulario */}
      <LeadForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        estados={MOCK_ESTADOS_LEAD}
        fuentes={MOCK_FUENTES_LEAD}
      />
    </div>
  );
}
