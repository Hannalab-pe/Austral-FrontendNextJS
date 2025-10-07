import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Spinner className="h-8 w-8" />
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Cargando...
            </h2>
            <p className="text-sm text-gray-500">
              Por favor espera un momento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}