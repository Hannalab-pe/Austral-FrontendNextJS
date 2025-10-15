'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  usuario: z.string().min(1, 'Usuario o email requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
  recordarme: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: '',
      contrasena: '',
      recordarme: false,
    },
  });

  // Verificar si el token expiró
  useEffect(() => {
    const expired = searchParams.get('expired');
    const from = searchParams.get('from');

    if (expired === 'true') {
      toast.error('Tu sesión ha expirado', {
        description: 'Por favor, inicia sesión nuevamente',
      });
    }

    if (from) {
      toast.info('Debes iniciar sesión para acceder a esta página');
    }
  }, [searchParams]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = searchParams.get('from') || '/clientes';
      router.push(from);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        usuario: data.usuario,
        contrasena: data.contrasena,
      });

      // El toast de éxito y la redirección se manejan en el store
      const from = searchParams.get('from') || '/clientes';
      router.push(from);
    } catch (error) {
      // El error ya se maneja en el store con toast
      console.error('Error en login:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
        <p className="text-muted-foreground">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Usuario/Email */}
        <div className="space-y-2">
          <Label htmlFor="usuario" className="text-base font-medium">
            Usuario o Email
          </Label>
          <Input
            id="usuario"
            type="text"
            placeholder="admin@austral.com o admin"
            className="h-11"
            {...register('usuario')}
            autoComplete="username"
            disabled={isLoading}
          />
          {errors.usuario && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.usuario.message}</span>
            </div>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className="space-y-2">
          <Label htmlFor="contrasena" className="text-base font-medium">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="contrasena"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="h-11 pr-10"
              {...register('contrasena')}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.contrasena && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.contrasena.message}</span>
            </div>
          )}
        </div>

        {/* Recordarme y Olvidé contraseña */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recordarme"
              checked={rememberMe}
              onCheckedChange={(checked: boolean) => setRememberMe(checked)}
              disabled={isLoading}
            />
            <label
              htmlFor="recordarme"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Recordarme
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón de envío */}
        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        {/* Información adicional */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>

      {/* Credenciales de prueba (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 rounded-lg bg-muted">
          <p className="text-xs font-semibold mb-2 text-muted-foreground">
            Credenciales de prueba:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Email: admin@austral.com</p>
            <p>Usuario: admin</p>
            <p>Contraseña: (consultar con el administrador)</p>
          </div>
        </div>
      )}
    </div>
  );
}