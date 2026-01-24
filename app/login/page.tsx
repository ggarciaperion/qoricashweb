'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, CreditCard, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api/auth';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import type { ForgotPasswordRequest } from '@/lib/types';

const loginSchema = z.object({
  dni: z.string().min(8, 'Ingresa un DNI válido').max(12, 'DNI inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [pendingLoginDni, setPendingLoginDni] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('📝 [LoginPage] Form submitted with DNI:', data.dni);
    setIsLoading(true);
    clearError();

    try {
      console.log('📝 [LoginPage] Calling login function...');

      // Call the login API directly to check for requires_password_change
      const response = await authApi.login({ dni: data.dni, password: data.password });
      console.log('📝 [LoginPage] Login response:', response);

      if (response.success && response.client) {
        // Check if password change is required
        if (response.requires_password_change) {
          console.log('🔐 [LoginPage] Password change required');
          setPendingLoginDni(data.dni);
          setIsChangePasswordModalOpen(true);
          setIsLoading(false);
          return;
        }

        // No password change required - proceed with normal login
        console.log('✅ [LoginPage] Login successful! Redirecting...');

        // Update the auth store
        const success = await login({ dni: data.dni, password: data.password });

        if (success) {
          console.log('🔄 [LoginPage] Redirecting to /dashboard');
          router.push('/dashboard');
        } else {
          console.log('❌ [LoginPage] Login failed after password check');
        }
      } else {
        console.log('❌ [LoginPage] Login failed:', response.message);
      }
    } catch (error: any) {
      console.error('❌ [LoginPage] Error en login:', error);
    } finally {
      setIsLoading(false);
      console.log('📝 [LoginPage] Loading finished');
    }
  };

  // Handle forgot password submission
  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      const result = await authApi.forgotPassword(data);
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al recuperar contraseña'
      };
    }
  };

  // Handle password change submission
  const handleChangePassword = async (newPassword: string) => {
    try {
      const result = await authApi.changePasswordWeb({
        dni: pendingLoginDni,
        new_password: newPassword
      });

      if (result.success) {
        // Close modal
        setIsChangePasswordModalOpen(false);

        // Now login with the new password
        const loginSuccess = await login({
          dni: pendingLoginDni,
          password: newPassword
        });

        if (loginSuccess) {
          router.push('/dashboard');
        }
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cambiar contraseña'
      };
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
          Volver al inicio
        </Link>

        {/* Login card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 border-2 border-white/60">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Inicia sesión en tu cuenta</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* DNI field */}
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                DNI / CE / RUC
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('dni')}
                  type="text"
                  id="dni"
                  className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.dni ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="12345678"
                  disabled={isLoading}
                />
              </div>
              {errors.dni && (
                <p className="mt-2 text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recuérdame
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-primary text-secondary py-3 px-4 rounded-xl font-bold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 backdrop-blur-sm text-gray-500">¿No tienes una cuenta?</span>
            </div>
          </div>

          {/* Register link */}
          <div className="mt-6 text-center">
            <Link
              href="/crear-cuenta"
              className="inline-flex items-center justify-center w-full border-2 border-primary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-primary-50 transition"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Tus datos están protegidos con encriptación de nivel bancario
        </p>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSubmit={handleForgotPassword}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onSubmit={handleChangePassword}
        canClose={false}
      />
    </main>
  );
}
