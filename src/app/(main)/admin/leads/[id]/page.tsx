import { VerLead } from "@/components/leads/VerLead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
 title: 'Austral | Detalles del Lead',
 description: 'Detalles del Lead seleccionado',
};

export default function DetallesLeadPage() {
  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalles del Lead</h1>
          <p className="text-gray-600">Información completa del lead seleccionado</p>
        </div>
      </div>

      {/* Componente de detalles del lead */}
      <VerLead/>
    </div>
  );
}