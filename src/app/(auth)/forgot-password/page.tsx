import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Recuperar Contraseña',
  description: 'Solicita un enlace para restablecer tu contraseña',
};

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center">
              <Image
                src="/images/austral-logo.png"
                alt="Austral Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            Austral
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Recuperar Contraseña</h1>
              <p className="text-muted-foreground">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Esta funcionalidad estará disponible próximamente.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Por favor, contacta al administrador del sistema para restablecer tu contraseña.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 relative hidden lg:block">
        {/* Background image opcional */}
      </div>
    </div>
  );
}