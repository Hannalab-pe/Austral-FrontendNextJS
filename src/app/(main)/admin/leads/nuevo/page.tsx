import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/leads/LeadForm";

export default function NuevoLeadPage() {
  return (
    <div className="w-full min-h-screen py-8 px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header estático */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/leads">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Nuevo Lead</h1>
            <p className="text-gray-600 mt-2">
              Registra una nueva oportunidad de negocio
            </p>
          </div>
        </div>

        {/* Formulario - Client Component con hooks */}
        <LeadForm />
      </div>
    </div>
  );
}
