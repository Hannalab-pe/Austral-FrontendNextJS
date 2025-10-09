
import LoginForm from '@/components/login/LoginForm';
import Image from 'next/image';

export const metadata = {
  title: 'Iniciar Sesión',
  description: 'Interfaz para iniciar sesión en Austral',
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
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
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 relative hidden lg:block">
        {/* <Image
          src="/images/austral-logo.png"
          alt="Austral Background"
          fill
          className="object-contain dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}