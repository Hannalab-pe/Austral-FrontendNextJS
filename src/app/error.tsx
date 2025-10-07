"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            ¡Algo salió mal!
          </CardTitle>
          <CardDescription>
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <Button 
              onClick={reset}
              variant="default"
              className="w-full"
            >
              Intentar nuevamente
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-2 bg-gray-100 rounded text-sm">
              <summary className="cursor-pointer font-semibold">
                Detalles del error (solo en desarrollo)
              </summary>
              <pre className="mt-2 text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}