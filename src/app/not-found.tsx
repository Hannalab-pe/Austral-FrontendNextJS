import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="text-6xl font-bold text-gray-400">404</div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Página no encontrada
          </CardTitle>
          <CardDescription>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                Ir al Login
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, por favor contacta al soporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}