'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: Implementar lógica de login
      console.log(data);
        toast.success('Inicio de sesión exitoso');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
        <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className='flex flex-col gap-2'>
          <Label htmlFor="email" className="text-lg font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="py-3 text-lg"
            {...register('email')}
            autoComplete='username'
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="password" className="text-lg font-medium">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            className="py-3 text-lg"
            {...register('password')}
            autoComplete='current-password'
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full py-3 text-lg">
          Iniciar Sesión
        </Button>
        <div className="text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
}