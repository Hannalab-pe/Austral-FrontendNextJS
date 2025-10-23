// app/(dashboard)/unauthorized/page.tsx
import { ShieldX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <ShieldX className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso Denegado
        </h1>

        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página. Si crees que esto es un error,
          contacta a tu administrador.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>

          <Link
            href="/perfil"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Ver Mi Perfil
          </Link>
        </div>
      </div>
    </div>
  );
}